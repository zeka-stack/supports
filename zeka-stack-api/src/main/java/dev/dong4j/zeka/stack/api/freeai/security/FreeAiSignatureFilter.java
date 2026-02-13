package dev.dong4j.zeka.stack.api.freeai.security;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.regex.Pattern;

import dev.dong4j.zeka.stack.api.auth.service.UserAccountService;
import dev.dong4j.zeka.stack.api.freeai.config.FreeAiProperties;
import dev.dong4j.zeka.stack.api.plugin.feedback.dto.FeedbackResponse;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * FreeAI 签名校验过滤器
 *
 * @author dong4j
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@Component
@Order(0)
@RequiredArgsConstructor
public class FreeAiSignatureFilter implements Filter {

    /** FreeAI 接口路径前缀, 用于标识需要签名校验的请求路径 */
    private static final String FREEAI_PATH_PREFIX = "/api/freeai/v1";
    /** HTTP 请求头中用于携带认证令牌的字段名 */
    private static final String HEADER_AUTHORIZATION = "Authorization";
    /** HTTP 请求头中的 User-Agent 字段名 */
    private static final String HEADER_USER_AGENT = "User-Agent";
    /** Bearer 认证前缀 */
    private static final String BEARER_PREFIX = "Bearer ";

    /**
     * FreeAI 属性配置
     * <p> 包含 FreeAI 相关的配置信息, 如密钥, 用户代理等
     *
     * @see FreeAiProperties
     */
    private final FreeAiProperties freeAiProperties;
    /** 用户账户服务, 用于处理与用户账户相关的操作, 如验证设备 ID 是否存在. */
    private final UserAccountService userAccountService;
    /** 用于序列化和反序列化 JSON 数据的对象映射器 */
    private final ObjectMapper objectMapper;

    /**
     * 执行 FreeAI 签名校验逻辑
     * <p> 该方法用于对符合特定路径的请求进行 FreeAI API Key 的验证, 包括检查 API Key 是否有效, 是否过期以及设备是否已注册.
     *
     * @param request  Servlet 请求对象
     * @param response Servlet 响应对象
     * @param chain    过滤器链对象
     * @throws IOException      如果发生 I/O 异常
     * @throws ServletException 如果发生 Servlet 异常
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (!shouldVerify(httpRequest)) {
            chain.doFilter(request, response);
            return;
        }

        if (!freeAiProperties.isEnabled()) {
            sendErrorResponse(httpResponse, "freeai is disabled");
            return;
        }

        if (!StringUtils.hasText(freeAiProperties.getMasterSecret())) {
            sendErrorResponse(httpResponse, "freeai secret is not configured");
            return;
        }

        String apiKey = extractApiKey(httpRequest.getHeader(HEADER_AUTHORIZATION));
        if (!StringUtils.hasText(apiKey)) {
            sendErrorResponse(httpResponse, "missing freeai api key");
            return;
        }
        if (!isAllowedUserAgent(httpRequest.getHeader(HEADER_USER_AGENT))) {
            sendErrorResponse(httpResponse, "user-agent is not allowed");
            return;
        }

        try {
            FreeAiApiKeyCodec.VerificationResult result = FreeAiApiKeyCodec.verify(freeAiProperties.getMasterSecret(), apiKey);
            if (!result.valid()) {
                sendErrorResponse(httpResponse, "invalid freeai api key");
                return;
            }

            long now = Instant.now().toEpochMilli();
            if (result.isExpired(now)) {
                sendErrorResponse(httpResponse, "freeai api key expired");
                return;
            }

            if (!userAccountService.existsByDeviceId(result.deviceId())) {
                sendErrorResponse(httpResponse, "device is not registered");
                return;
            }

            chain.doFilter(request, response);
        } catch (Exception e) {
            log.debug("freeai apikey verification error", e);
            sendErrorResponse(httpResponse, "freeai apikey verification error");
        }
    }

    /**
     * 判断是否应该对 HTTP 请求进行签名校验
     * <p> 此方法基于请求的 HTTP 方法和 URI 路径来决定是否说明签名校验逻辑是否需要执行.</p>
     * <p> 若请求方法为 <code>OPTIONS</code>(跨域预检请求), 则无需签名校验; 否则仅当请求路径非空且以
     * {@link #FREEAI_PATH_PREFIX} 开头时才需要校验.</p>
     *
     * @param request 当前 HTTP 请求对象
     * @return 当且仅当请求方法不是 <code>OPTIONS</code> 且 URI 路径以 {@code /api/freeai/v1} 开头时返回 {@code true}, 否则返回 {@code false}
     */
    private boolean shouldVerify(HttpServletRequest request) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return false;
        }
        String path = request.getRequestURI();
        return path != null && path.startsWith(FREEAI_PATH_PREFIX);
    }

    /**
     * 从授权头中提取 API 密钥.
     * <p> 该方法会先判断传入的 {@code authorization} 是否为空或只包含空白字符, 若是则返回 {@code null}. 如果授权头以 {@code BEARER_PREFIX}(例如 <code>Bearer </code>) 开头,
     * 则去掉该前缀并返回剩余字符串; 若不以该前缀开头, 则直接返回去除前后空白后的字符串.</p>
     *
     * @param authorization HTTP 请求头中 {@code Authorization} 字段的原始值
     * @return 去除前缀并已去空格的 API 密钥; 若原始值为空或为空白字符串则返回 {@code null}
     */
    private String extractApiKey(String authorization) {
        if (!StringUtils.hasText(authorization)) {
            return null;
        }
        if (authorization.startsWith(BEARER_PREFIX)) {
            return authorization.substring(BEARER_PREFIX.length()).trim();
        }
        return authorization.trim();
    }

    /**
     * 检查 User-Agent 是否符合允许的访问规则
     *
     * @param userAgent HTTP 请求头中的 User-Agent 字符串
     * @return 如果 User-Agent 不为空且匹配配置中的任一允许模式, 则返回 true; 否则返回 false
     */
    private boolean isAllowedUserAgent(String userAgent) {
        if (!StringUtils.hasText(userAgent)) {
            return false;
        }
        List<String> patterns = freeAiProperties.getAllowedUserAgents();
        if (patterns == null || patterns.isEmpty()) {
            return false;
        }
        for (String pattern : patterns) {
            if (!StringUtils.hasText(pattern)) {
                continue;
            }
            if (globMatch(pattern.trim(), userAgent)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 将 glob 表达式转换为正则表达式并进行匹配
     * <p> 该方法支持简单的通配符匹配, 其中 '*' 被视为匹配任意字符的正则表达式 '.*', 其他字符会自动进行转义以确保精确匹配.
     *
     * @param glob 包含通配符的 glob 表达式 (例如 "foo*.txt")
     * @param text 需要被匹配的目标字符串
     * @return 如果文本匹配 glob 表达式则返回 true, 否则返回 false
     */
    private boolean globMatch(String glob, String text) {
        StringBuilder regex = new StringBuilder("^");
        for (int i = 0; i < glob.length(); i++) {
            char ch = glob.charAt(i);
            if (ch == '*') {
                regex.append(".*");
            } else {
                regex.append(Pattern.quote(String.valueOf(ch)));
            }
        }
        regex.append("$");
        return Pattern.compile(regex.toString()).matcher(text).matches();
    }

    /**
     * 发送错误响应
     * <p> 设置 HTTP 响应状态为 401 (Unauthorized), 并将指定的错误消息以 JSON 格式写入响应流中.
     *
     * @param response Servlet 响应对象, 用于写入错误信息
     * @param message  错误消息内容
     * @throws IOException 如果发生 I/O 异常
     */
    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        FeedbackResponse errorResponse = FeedbackResponse.builder()
            .success(false)
            .error("Unauthorized: " + message)
            .build();

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        response.getWriter().flush();
    }
}
