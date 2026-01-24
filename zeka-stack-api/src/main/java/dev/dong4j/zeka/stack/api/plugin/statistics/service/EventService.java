package dev.dong4j.zeka.stack.api.plugin.statistics.service;

import java.util.List;

import dev.dong4j.zeka.stack.api.plugin.statistics.entity.dto.EventDTO;
import dev.dong4j.zeka.stack.api.plugin.statistics.entity.dto.TokenRankingDTO;
import dev.dong4j.zeka.stack.api.plugin.statistics.entity.form.EventForm;
import dev.dong4j.zeka.stack.api.plugin.statistics.entity.form.EventUploadForm;
import dev.dong4j.zeka.stack.api.plugin.statistics.entity.po.Event;
import dev.dong4j.zeka.starter.mybatis.service.BaseService;

/**
 * <p> 统计事件表 服务接口 </p>
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.01.19 11:55
 * @since 1.0.0
 */
public interface EventService extends BaseService<Event> {

    /**
     * 根据 ID 获取详细信息
     *
     * @param id 主键
     * @return 实体对象
     * @since 1.0.0
     */
    EventDTO detail(Long id);

    /**
     * 批量上报
     *
     * @param form 批量上报参数
     * @since 1.0.0
     */
    void create(EventUploadForm form);

    /**
     * 新增数据
     *
     * @param form 参数实体
     * @since 1.0.0
     */
    void create(EventForm form);

    /**
     * 更新数据
     *
     * @param form 参数实体
     * @since 1.0.0
     */
    void edit(EventForm form);

    /**
     * 获取 Token 使用量排名
     *
     * @param limit 查询数量
     * @return Token 排名列表
     * @since 1.0.0
     */
    List<TokenRankingDTO> getTokenRanking(int limit);

}
