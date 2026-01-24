package dev.dong4j.zeka.stack.api.plugin.statistics.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

import dev.dong4j.zeka.stack.api.plugin.statistics.entity.dto.TokenRankingDTO;
import dev.dong4j.zeka.stack.api.plugin.statistics.entity.po.Event;
import dev.dong4j.zeka.starter.mybatis.base.BaseDao;

/**
 * <p> 统计事件表 Dao 接口  </p>
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.01.19 11:55
 * @since 1.0.0
 */
@Mapper
public interface EventMapper extends BaseDao<Event> {

    /**
     * 查询 Token 使用量排名前 N 的用户
     *
     * @param limit 查询数量
     * @return Token 排名列表
     * @since 1.0.0
     */
    List<TokenRankingDTO> selectTokenRanking(@Param("limit") int limit);

}
