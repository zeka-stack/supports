package dev.dong4j.zeka.stack.api.plugin.model.service;

import org.springframework.stereotype.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 智谱 AI 模型服务（兼容旧调用方）
 * <p>
 * 实际数据委托 {@link ModelCatalogService}，避免双份维护。
 *
 * @author dong4j
 * @version 1.0.0
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ZhipuModelService {

    private final ModelCatalogService modelCatalogService;

    /**
     * 获取智谱 AI 可用模型列表
     *
     * @return 模型名称列表
     */
    public List<String> getAvailableModels() {
        List<String> models = modelCatalogService.getByProviderId("zhipu").getModels();
        log.info("成功获取 {} 个智谱 AI 模型", models.size());
        return models;
    }
}
