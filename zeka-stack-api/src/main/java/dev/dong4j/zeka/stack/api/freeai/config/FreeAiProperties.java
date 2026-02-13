package dev.dong4j.zeka.stack.api.freeai.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 * FreeAi 配置属性类
 * <p> 用于从配置文件中读取 FreeAi 相关的配置参数, 并将其自动映射到当前的 Bean 中
 * <p> 主要配置项包括功能开关, 上游服务地址, 主密钥以及允许的用户代理列表
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@Data
@Component
@ConfigurationProperties(prefix = "freeai")
public class FreeAiProperties {

    /** 是否启用 freeai 中转 */
    private boolean enabled = true;

    /** FreeAI 上游服务地址 */
    private String upstreamBaseUrl;

    /** FreeAI 上游 API Key（仅服务端持有） */
    private String upstreamApiKey;

    /** FreeAI 上游鉴权头名，默认 Authorization */
    private String upstreamAuthHeader = "Authorization";

    /** FreeAI 上游鉴权前缀，默认 Bearer */
    private String upstreamAuthPrefix = "Bearer ";

    /** 设备密钥派生主密钥 */
    private String masterSecret;

    /** 允许访问 freeai 的 User-Agent 通配规则 */
    private List<String> allowedUserAgents = new ArrayList<>();
}
