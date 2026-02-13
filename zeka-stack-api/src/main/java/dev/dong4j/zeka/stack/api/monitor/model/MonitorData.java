package dev.dong4j.zeka.stack.api.monitor.model;

import java.util.List;

import lombok.Builder;
import lombok.Data;

/**
 * 监控数据模型类
 * <p> 用于封装系统各组件的监控数据, 包括引擎节点, 云服务节点, 本地实验室数据及全局统计信息.
 * 该类采用 Lombok 的 @Data 和 @Builder 注解, 自动生成 getter,setter,toString,equals,hashCode 及构建器方法.
 * 内部嵌套类 {@code HomelabData} 用于描述本地实验室环境中的网关与计算节点列表;
 * 内部嵌套类 {@code GlobalStats} 用于记录全局性能指标, 如总令牌数, 请求数, 平均延迟和系统运行时间.
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@Data
@Builder
public class MonitorData {
    /** 引擎服务节点数据 */
    private ServiceNode engine;
    /**
     * 云服务节点信息
     * <p> 表示与云相关的服务节点数据
     */
    private ServiceNode cloud;
    /**
     * 本地实验室数据
     * <p> 包含网关和服务节点等本地实验室相关信息
     */
    private HomelabData homelab;
    /**
     * 负责存放全局监控统计信息.
     * <p> 该字段包括总令牌数, 请求次数, 平均延迟时间以及服务正常运行时间.</p>
     *
     * @see GlobalStats
     */
    private GlobalStats stats;

    /**
     * Homelab 数据类
     * <p> 用于表示 Homelab 环境中的服务节点数据, 包含网关节点列表和计算节点列表.
     * 该类作为 MonitorData 的内部静态类, 专门用于封装 Homelab 相关的监控数据.
     *
     * @author dong4j
     * @version 1.0.0
     * @email "mailto:dong4j@gmail.com"
     * @date 2026.02.13
     * @since 1.0.0
     */
    @Data
    @Builder
    public static class HomelabData {
        /** 网关服务节点列表 */
        private List<ServiceNode> gateways;
        /** 计算服务节点列表 */
        private List<ServiceNode> compute;
    }

    /**
     * 全局统计数据类
     * <p> 用于存储和表示系统运行过程中的全局统计数据, 包括总请求数, 请求次数, 平均延迟时间以及系统运行时长等信息.
     *
     * @author dong4j
     * @version 1.0.0
     * @email "mailto:dong4j@gmail.com"
     * @date 2026.02.13
     * @since 1.0.0
     */
    @Data
    @Builder
    public static class GlobalStats {
        /** 总令牌数量 */
        private long totalTokens;
        /** 请求次数 */
        private long requests;
        /** 平均延迟时间, 单位通常为毫秒, 用于衡量系统响应速度 */
        private String avgLatency;
        /** 系统运行时长 */
        private String uptime;
    }
}
