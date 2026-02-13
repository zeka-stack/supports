package dev.dong4j.zeka.stack.api.monitor.model;

import java.util.List;

import lombok.Builder;
import lombok.Data;

/**
 * 服务节点实体类
 * <p>用于表示系统中的服务节点信息, 支持层级结构.
 * 包含节点的基本属性 (如 ID, 名称, 类型, 状态) 以及子节点列表和统计数据项
 * <p>该类使用 Lombok 注解简化代码,@Builder 支持构建器模式创建对象,@Data 自动生成 getter/setter 等方法
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@Data
@Builder
public class ServiceNode {
    /** 服务节点的唯一标识符 */
    private String id;
    /** 服务节点名称 */
    private String name;
    /** 服务节点类型 */
    private String type;
    /** 服务节点状态 */
    private String status;
    /** 子节点列表 */
    private List<ServiceNode> subNodes;
    /** 统计项列表 */
    private List<StatItem> stats;

    /**
     * 服务节点统计项
     * <p> 用于表示服务节点的统计信息, 包含标签和对应的值
     *
     * @author dong4j
     * @version 1.0.0
     * @email "mailto:dong4j@gmail.com"
     * @date 2026.02.13
     * @since 1.0.0
     */
    @Data
    @Builder
    public static class StatItem {
        /** 标签 */
        private String label;
        /** 统计数值 */
        private String value;
    }
}
