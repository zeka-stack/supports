package dev.dong4j.zeka.stack.api.plugin.model.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

import dev.dong4j.zeka.stack.api.plugin.model.dto.ModelResponse;
import dev.dong4j.zeka.stack.api.plugin.model.service.ModelCatalogService;
import dev.dong4j.zeka.starter.rest.annotation.RestControllerWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 插件推荐模型目录接口
 * <p>
 * 路径前缀 {@code /plugin/v1/models}：
 * <ul>
 *   <li>{@code GET /} — 全部已配置服务商</li>
 *   <li>{@code GET /{providerId}} — 单个服务商（与插件 AIProviderType.providerId 对齐）</li>
 *   <li>{@code GET /zhipu} — 历史兼容，等同 {@code glm}/{@code zhipu}</li>
 * </ul>
 *
 * @author dong4j
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@RestControllerWrapper("/plugin/v1/models")
@RequiredArgsConstructor
public class ModelController {

    private final ModelCatalogService modelCatalogService;

    /**
     * 获取全部推荐模型目录
     *
     * @return providerId → ModelResponse
     */
    @GetMapping
    public Map<String, ModelResponse> listAll() {
        return modelCatalogService.getAll();
    }

    /**
     * 历史兼容：智谱推荐列表
     *
     * @return 智谱/glm 模型目录
     */
    @GetMapping("/zhipu")
    public ModelResponse getZhipuModels() {
        return modelCatalogService.getByProviderId("zhipu");
    }

    /**
     * 按插件 providerId 获取推荐模型目录
     *
     * @param providerId 如 anthropic、deepseek、deepseek_anthropic、glm、moonshot_anthropic
     * @return 模型目录
     */
    @GetMapping("/{providerId}")
    public ModelResponse getByProvider(@PathVariable("providerId") String providerId) {
        return modelCatalogService.getByProviderId(providerId);
    }
}
