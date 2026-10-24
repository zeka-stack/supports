package dev.dong4j.zeka.stack.api.plugin.model.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * 插件推荐模型目录配置
 * <p>
 * 绑定 {@code plugin.models}，按插件 {@code AIProviderType.providerId} 维护推荐模型列表与默认模型。
 * 支持 {@code alias-of} 指向另一 provider，避免 OpenAI/Anthropic 双入口重复维护。
 *
 * @author dong4j
 * @version 1.0.0
 * @since 1.0.0
 */
@Data
@Component
@ConfigurationProperties(prefix = "plugin.models")
public class PluginModelProperties {

    /**
     * providerId → 推荐目录
     */
    private Map<String, ProviderModels> providers = new LinkedHashMap<>();

    /**
     * 单个服务商的推荐模型配置
     */
    @Data
    public static class ProviderModels {
        /**
         * 若设置，则解析到目标 provider（本条目的 models/defaultModel 可为空）
         */
        private String aliasOf;

        /**
         * 推荐默认模型
         */
        private String defaultModel;

        /**
         * 推荐模型列表（精选，非厂商全量）
         */
        private List<String> models = new ArrayList<>();
    }
}
