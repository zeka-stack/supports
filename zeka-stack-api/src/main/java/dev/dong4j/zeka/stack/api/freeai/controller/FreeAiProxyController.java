package dev.dong4j.zeka.stack.api.freeai.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.Set;

import dev.dong4j.zeka.stack.api.freeai.config.FreeAiProperties;
import dev.dong4j.zeka.starter.rest.annotation.RestControllerWrapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

/**
 * 自由 AI 代理控制器
 * <p> 提供对上游自由 AI 服务的透明代理转发功能, 支持 HTTP 请求的转发, 头信息过滤与响应回传.
 * 该控制器通过拦截所有匹配路径的请求, 将其转发至配置的上游服务地址, 并在转发过程中过滤掉与代理相关的中间层头信息 (如 Connection,Proxy-Authorization 等), 同时保留必要的内部签名头 (如 Authorization,
 * X-Timestamp 等).
 * 适用于需要在后端统一管理 AI 服务调用, 实现服务隔离或安全签名验证的场景.
 * <p> 支持的请求方法包括:GET,POST,PUT,DELETE,OPTIONS,HEAD 等, 根据请求方法决定是否携带请求体.
 * <p> 请求体读取使用固定缓冲区大小 (16KB), 确保内存安全.
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@Slf4j
@RestControllerWrapper("/freeai/v1")
@RequiredArgsConstructor
public class FreeAiProxyController {

    /** HTTP 中转头字段集合, 用于在代理请求中过滤或保留特定的 HTTP 头部, 避免传递给后端服务 */
    private static final Set<String> HOP_HEADERS = Set.of(
        HttpHeaders.CONNECTION.toLowerCase(),
        "keep-alive",
        HttpHeaders.PROXY_AUTHENTICATE.toLowerCase(),
        HttpHeaders.PROXY_AUTHORIZATION.toLowerCase(),
        HttpHeaders.TE.toLowerCase(),
        HttpHeaders.TRAILER.toLowerCase(),
        HttpHeaders.TRANSFER_ENCODING.toLowerCase(),
        HttpHeaders.UPGRADE.toLowerCase(),
        HttpHeaders.HOST.toLowerCase(),
        HttpHeaders.CONTENT_LENGTH.toLowerCase()
                                                         );

    /**
     * 内部签名头部字段集合
     * <p> 包含用于请求签名的各种认证和签名相关的 HTTP 头部字段, 如 authorization,x-signature 等 </p>
     */
    private static final Set<String> INTERNAL_SIGNATURE_HEADERS = Set.of(
        "authorization",
        "x-type",
        "x-device-id",
        "x-timestamp",
        "x-nonce",
        "x-signature",
        "x-body-sha256"
                                                                        );

    /**
     * 缓冲区大小, 单位为字节
     * <p> 默认值为 16KB
     */
    private static final int BUFFER_SIZE = 16 * 1024;

    /** 用于发送 HTTP 请求的 OkHttp 客户端实例 */
    private final OkHttpClient okHttpClient;
    /** FreeAI 配置属性 */
    private final FreeAiProperties freeAiProperties;

    /**
     * FreeAI 代理请求处理方法
     * <p> 接收传入的 HTTP 请求, 将其代理转发至配置的上游服务, 并将上游响应返回给客户端.
     * <p> 该方法会处理请求头, 请求体以及响应流的转发, 并过滤特定的 Hop-by-hop 头部和内部签名头部.
     *
     * @param request  HTTP 请求对象, 包含客户端发送的请求数据
     * @param response HTTP 响应对象, 用于将上游服务的响应返回给客户端
     * @throws IOException 当读取请求数据, 网络通信或写入响应数据时发生 I/O 错误抛出
     */
    @RequestMapping(value = {"", "/**"})
    public void proxy(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!freeAiProperties.isEnabled()) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "freeai proxy is disabled");
            return;
        }
        if (!StringUtils.hasText(freeAiProperties.getUpstreamBaseUrl())) {
            response.sendError(HttpServletResponse.SC_SERVICE_UNAVAILABLE, "freeai upstream is not configured");
            return;
        }

        String upstreamUrl = buildUpstreamUrl(request);
        byte[] requestBody = request.getInputStream().readAllBytes();

        Request.Builder builder = new Request.Builder().url(upstreamUrl);
        copyRequestHeaders(request, builder);

        RequestBody body = buildRequestBody(request, requestBody);
        builder.method(request.getMethod(), body);

        try (Response upstreamResponse = okHttpClient.newCall(builder.build()).execute()) {
            response.setStatus(upstreamResponse.code());
            copyResponseHeaders(upstreamResponse, response);

            ResponseBody responseBody = upstreamResponse.body();
            if (responseBody == null) {
                return;
            }

            try (InputStream input = responseBody.byteStream();
                 OutputStream output = response.getOutputStream()) {
                byte[] buffer = new byte[BUFFER_SIZE];
                int len;
                while ((len = input.read(buffer)) != -1) {
                    output.write(buffer, 0, len);
                    output.flush();
                }
            }
        }
    }

    /**
     * 构建 OkHttp 请求体
     * <p> 根据 HTTP 请求方法和内容类型, 将字节数组转换为 OkHttp 的 RequestBody 对象.
     * <p> 对于 GET,HEAD,DELETE 和 OPTIONS 方法, 返回 null(不带请求体).
     *
     * @param request   HttpServletRequest 对象, 包含 HTTP 方法和内容类型信息
     * @param bodyBytes 请求体的原始字节数据
     * @return 构建好的 RequestBody 对象, 如果当前 HTTP 方法不支持请求体则返回 null
     */
    private RequestBody buildRequestBody(HttpServletRequest request, byte[] bodyBytes) {
        String method = request.getMethod();
        boolean noBodyMethod = "GET".equalsIgnoreCase(method)
                               || "HEAD".equalsIgnoreCase(method)
                               || "DELETE".equalsIgnoreCase(method)
                               || "OPTIONS".equalsIgnoreCase(method);
        if (noBodyMethod) {
            return null;
        }
        MediaType mediaType = MediaType.parse(request.getContentType());
        return RequestBody.create(bodyBytes, mediaType);
    }

    /**
     * 复制请求头到 OkHttp 请求构建器中, 过滤掉特定的 Hop 头和内部签名头
     * <p>遍历请求中的所有头名称, 若头名称属于跳转头 (Hop Headers) 或内部签名头(Internal Signature Headers), 则跳过不复制; 否则将该头及其所有值添加到构建器中
     *
     * @param request HttpServletRequest 对象, 包含原始请求的头信息
     * @param builder Request.Builder 对象, 用于构建发送到上游服务的 HTTP 请求
     * @since 1.0.0
     */
    private void copyRequestHeaders(HttpServletRequest request, Request.Builder builder) {
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String lowerHeaderName = headerName.toLowerCase();
            if (HOP_HEADERS.contains(lowerHeaderName) || INTERNAL_SIGNATURE_HEADERS.contains(lowerHeaderName)) {
                continue;
            }
            Enumeration<String> values = request.getHeaders(headerName);
            while (values.hasMoreElements()) {
                builder.addHeader(headerName, values.nextElement());
            }
        }
    }

    /**
     * 复制上游响应头到当前响应对象
     * <p> 遍历上游响应的所有头信息, 并将非跳过类型的头添加到当前 HTTP 响应中.
     *
     * @param upstreamResponse 上游响应对象, 包含需要复制的头信息
     * @param response         当前 HTTP 响应对象, 用于添加头信息
     */
    private void copyResponseHeaders(Response upstreamResponse, HttpServletResponse response) {
        okhttp3.Headers headers = upstreamResponse.headers();
        for (int i = 0; i < headers.size(); i++) {
            String headerName = headers.name(i);
            if (HOP_HEADERS.contains(headerName.toLowerCase())) {
                continue;
            }
            response.addHeader(headerName, headers.value(i));
        }
    }

    /**
     * 构建上游服务的完整 URL
     * <p> 根据请求的 URI 和上下文路径构建上游服务的完整 URL, 并处理查询字符串
     *
     * @param request HttpServletRequest 对象, 包含请求信息
     * @return 构建好的上游服务 URL
     */
    private String buildUpstreamUrl(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();
        String prefix = contextPath + "/freeai/v1";
        String suffixPath = requestUri.startsWith(prefix) ? requestUri.substring(prefix.length()) : "";
        if (!StringUtils.hasText(suffixPath)) {
            suffixPath = "/";
        }

        String base = freeAiProperties.getUpstreamBaseUrl();
        String normalizedBase = base.endsWith("/") ? base.substring(0, base.length() - 1) : base;
        String normalizedPath = suffixPath.startsWith("/") ? suffixPath : "/" + suffixPath;

        String query = request.getQueryString();
        if (StringUtils.hasText(query)) {
            return normalizedBase + normalizedPath + "?" + query;
        }
        return normalizedBase + normalizedPath;
    }
}
