package dev.dong4j.zeka.stack.api.monitor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 * 监控配置属性类
 * <p> 用于配置监控系统的节点信息, 支持通过配置文件动态配置监控节点的各项参数
 * <p> 该类使用 {@code @ConfigurationProperties} 注解与配置文件中的 {@code monitor} 前缀进行绑定
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@Data
@Component
@ConfigurationProperties(prefix = "monitor")
public class MonitorProperties {
    /**
     * 监控节点配置列表
     * <p> 包含所有被监控的节点配置, 如 ID, 名称, 类型, 主机, 端口, 检查类型, 分组及父节点 ID 等信息
     *
     * @see NodeConfig
     */
    private List<NodeConfig> nodes = new ArrayList<>();

    /**
     * 节点配置类
     * <p> 用于定义监控系统中各个节点的配置信息, 包括节点标识, 名称, 类型, 主机地址, 端口, 健康检查方式, 所属分组及父节点 ID 等属性.
     * 该类作为嵌套静态内部类, 配合 {@code MonitorProperties} 使用, 用于从配置文件中绑定节点配置数据.
     * <pre>{@code
     * @Data
     * public static class NodeConfig {
     *     private String id;
     *     private String name;
     *     private String type; // client, cloud, gateway, compute, service, container
     *     private String host;
     *     private Integer port;
     *     private String checkType; // ping, tcp, http
     *     private String group; // homelab.gateways, homelab.compute
     *     private String parentId; // for nested services
     * }
     * }</pre>
     *
     * @author dong4j
     * @version 1.0.0
     * @email "mailto:dong4j@gmail.com"
     * @date 2026.02.13
     * @since 1.0.0
     */
    @Data
    public static class NodeConfig {
        /** 节点唯一标识符 */
        private String id;
        /** 节点名称 */
        private String name;
        /** 节点类型, 可取值为 client,cloud,gateway,compute,service,container */
        private String type; // client, cloud, gateway, compute, service, container
        /** 主机地址 */
        private String host;
        /** 端口号 */
        private Integer port;
        /** 节点健康检查类型, 可取值为 ping,tcp 或 http */
        private String checkType; // ping, tcp, http
        /**
         * 节点所属的组
         * <p> 例如:homelab.gateways, homelab.compute
         */
        private String group; // homelab.gateways, homelab.compute
        /** 父节点 ID, 用于表示嵌套服务的层级关系 */
        private String parentId; // for nested services
    }
}
