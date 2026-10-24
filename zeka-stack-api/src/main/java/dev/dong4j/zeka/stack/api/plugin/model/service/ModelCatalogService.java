package dev.dong4j.zeka.stack.api.plugin.model.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import dev.dong4j.zeka.stack.api.plugin.model.config.PluginModelProperties;
import dev.dong4j.zeka.stack.api.plugin.model.config.ZhipuProperties;
import dev.dong4j.zeka.stack.api.plugin.model.dto.ModelResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 插件推荐模型目录服务
 * <p>
 * 优先读 {@link PluginModelProperties}；对历史 {@code zhipu} 路径兼容 {@link ZhipuProperties}。
 *
 * @author dong4j
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ModelCatalogService {

    private final PluginModelProperties pluginModelProperties;
    private final ZhipuProperties zhipuProperties;

    /**
     * 按 providerId 获取推荐模型目录
     *
     * @param providerId 插件 AIProviderType.providerId（支持 zhipu→glm 别名）
     * @return 响应；未知 provider 时 models 为空列表
     */
    public ModelResponse getByProviderId(String providerId) {
        String id = normalize(providerId);
        Resolved resolved = resolve(id);
        return ModelResponse.builder()
            .provider(id)
            .defaultModel(resolved.defaultModel())
            .models(resolved.models())
            .total(resolved.models().size())
            .build();
    }

    /**
     * 返回全部已配置 provider 的目录（alias 展开后各自一条）
     *
     * @return providerId → ModelResponse
     */
    public Map<String, ModelResponse> getAll() {
        Map<String, ModelResponse> result = new LinkedHashMap<>();
        for (String key : pluginModelProperties.getProviders().keySet()) {
            String id = normalize(key);
            if (result.containsKey(id)) {
                continue;
            }
            PluginModelProperties.ProviderModels cfg = pluginModelProperties.getProviders().get(key);
            if (cfg != null && cfg.getAliasOf() != null && !cfg.getAliasOf().isBlank()) {
                // 别名条目也单独暴露，便于插件按真实 providerId 查询
                result.put(id, getByProviderId(id));
            } else {
                result.put(id, getByProviderId(id));
            }
        }
        // 兼容：若 yml 未配 glm/zhipu，仍可用旧 zhipu.default-models
        if (!result.containsKey("glm") && !result.containsKey("zhipu")) {
            result.put("zhipu", getByProviderId("zhipu"));
        }
        return result;
    }

    private Resolved resolve(String providerId) {
        // 显式别名：zhipu → glm（即使未配 alias-of）
        if ("zhipu".equals(providerId) && pluginModelProperties.getProviders().containsKey("glm")
            && !pluginModelProperties.getProviders().containsKey("zhipu")) {
            return resolve("glm");
        }

        PluginModelProperties.ProviderModels direct = pluginModelProperties.getProviders().get(providerId);
        if (direct != null) {
            if (direct.getAliasOf() != null && !direct.getAliasOf().isBlank()) {
                return resolve(normalize(direct.getAliasOf()));
            }
            List<String> models = copyNonBlank(direct.getModels());
            String defaultModel = firstNonBlank(direct.getDefaultModel(), models);
            if (!models.isEmpty()) {
                return new Resolved(defaultModel, models);
            }
        }

        // 历史兼容：zhipu / glm 回退 application.yml 的 zhipu.default-models
        if ("zhipu".equals(providerId) || "glm".equals(providerId) || "glm_anthropic".equals(providerId)) {
            List<String> legacy = copyNonBlank(zhipuProperties.getDefaultModels());
            if (!legacy.isEmpty()) {
                return new Resolved(legacy.getFirst(), legacy);
            }
            return new Resolved("glm-4.7", List.of("glm-4.7"));
        }

        log.warn("未配置推荐模型目录: providerId={}", providerId);
        return new Resolved(null, List.of());
    }

    private static String normalize(String providerId) {
        return Optional.ofNullable(providerId).orElse("").trim().toLowerCase(Locale.ROOT);
    }

    private static List<String> copyNonBlank(List<String> source) {
        if (source == null || source.isEmpty()) {
            return List.of();
        }
        List<String> out = new ArrayList<>();
        for (String m : source) {
            if (m != null && !m.isBlank()) {
                out.add(m.trim());
            }
        }
        return Collections.unmodifiableList(out);
    }

    private static String firstNonBlank(String defaultModel, List<String> models) {
        if (defaultModel != null && !defaultModel.isBlank()) {
            return defaultModel.trim();
        }
        return models.isEmpty() ? null : models.getFirst();
    }

    private record Resolved(String defaultModel, List<String> models) {
    }
}
