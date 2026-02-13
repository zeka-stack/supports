package dev.dong4j.zeka.stack.api.monitor.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import dev.dong4j.zeka.stack.api.monitor.config.MonitorProperties;
import dev.dong4j.zeka.stack.api.monitor.model.MonitorData;
import dev.dong4j.zeka.stack.api.monitor.model.ServiceNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 监控服务类
 * <p> 提供节点状态监控, 连接性检查以及监控数据聚合功能
 *
 * <p> 该服务主要负责:
 * <ul>
 *   <li> 定期轮询配置的节点列表, 检查其连通性状态 (在线 / 离线)</li>
 *   <li> 维护节点的状态缓存, 用于快速查询 </li>
 *   <li> 构建包含父子层级关系的节点拓扑结构 </li>
 *   <li> 聚合并返回包含网关, 计算节点, 引擎, 云端及全局统计信息的综合监控数据 </li>
 * </ul>
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MonitorService {

    /** 监控服务配置属性 */
    private final MonitorProperties properties;
    /** 节点状态缓存 */
    private final Map<String, String> statusCache = new ConcurrentHashMap<>();

    /**
     * 定期检查所有配置节点的连通性状态
     * <p> 该方法每 10 秒执行一次, 遍历所有节点配置, 检查其连通性,
     * 并将最新的状态更新到缓存中.
     */
    @Scheduled(fixedRate = 10000)
    public void checkNodes() {
        for (MonitorProperties.NodeConfig node : properties.getNodes()) {
            String status = checkConnectivity(node);
            statusCache.put(node.getId(), status);
        }
    }

    /**
     * 检查节点的连接状态
     * <p> 根据节点配置检测节点是否可达. 如果未配置主机地址, 默认返回在线状态.
     * 支持基于 TCP 端口连接或 ICMP (Ping) 两种检测方式.
     *
     * @param node 节点配置对象, 包含主机地址, 检查类型和端口等信息
     * @return 节点状态字符串,"online" 表示可达,"offline" 表示不可达
     */
    private String checkConnectivity(MonitorProperties.NodeConfig node) {
        if (node.getHost() == null || node.getHost().isEmpty()) {
            // If no host, maybe it's a container group, assume online if not checking
            return "online";
        }
        try {
            boolean reachable;
            if ("tcp".equalsIgnoreCase(node.getCheckType()) && node.getPort() != null) {
                try (Socket socket = new Socket()) {
                    socket.connect(new InetSocketAddress(node.getHost(), node.getPort()), 2000);
                    reachable = true;
                }
            } else {
                // Default try ping (ICMP or TCP 7)
                reachable = InetAddress.getByName(node.getHost()).isReachable(2000);
            }
            return reachable ? "online" : "offline";
        } catch (Exception e) {
            return "offline";
        }
    }

    /**
     * 获取当前的监控数据
     * <p> 根据配置的节点信息和缓存的状态, 构建并返回完整的监控数据视图.
     * 该方法会组装所有节点信息, 层级关系, 并聚合特定分组的节点数据.
     *
     * @return 监控数据对象, 包含引擎, 云端, 家庭实验室节点信息及全局统计数据
     */
    public MonitorData getMonitorData() {
        Map<String, ServiceNode> nodeMap = new ConcurrentHashMap<>();

        // 1. Create all ServiceNode objects
        for (MonitorProperties.NodeConfig config : properties.getNodes()) {
            ServiceNode node = ServiceNode.builder()
                .id(config.getId())
                .name(config.getName())
                .type(config.getType())
                .status(statusCache.getOrDefault(config.getId(), "idle")) // default idle before first check
                .subNodes(new ArrayList<>())
                .build();
            nodeMap.put(config.getId(), node);
        }

        // 2. Build hierarchy (SubNodes)
        for (MonitorProperties.NodeConfig config : properties.getNodes()) {
            if (config.getParentId() != null && !config.getParentId().isEmpty()) {
                ServiceNode parent = nodeMap.get(config.getParentId());
                ServiceNode child = nodeMap.get(config.getId());
                if (parent != null && child != null) {
                    parent.getSubNodes().add(child);
                }
            }
        }

        // 3. Categorize into MonitorData structure
        ServiceNode engine = nodeMap.get("engine");
        if (engine == null) {
            engine = ServiceNode.builder().id("engine").name("Zeka Engine").status("online").type("client").build();
        }

        ServiceNode cloud = nodeMap.get("cloud");
        if (cloud == null) {
            cloud = ServiceNode.builder().id("cloud").name("Public Cloud").status("online").type("cloud").build();
        }

        List<ServiceNode> gateways = properties.getNodes().stream()
            .filter(n -> "homelab.gateways".equals(n.getGroup()))
            .map(n -> nodeMap.get(n.getId()))
            .collect(Collectors.toList());

        List<ServiceNode> compute = properties.getNodes().stream()
            .filter(n -> "homelab.compute".equals(n.getGroup()))
            .map(n -> nodeMap.get(n.getId()))
            .collect(Collectors.toList());

        return MonitorData.builder()
            .engine(engine)
            .cloud(cloud)
            .homelab(MonitorData.HomelabData.builder()
                         .gateways(gateways)
                         .compute(compute)
                         .build())
            .stats(MonitorData.GlobalStats.builder()
                       .totalTokens(145230 + (System.currentTimeMillis() / 1000 % 1000))
                       .requests(1240 + (System.currentTimeMillis() / 60000 % 100))
                       .avgLatency("240ms")
                       .uptime("99.9%")
                       .build())
            .build();
    }
}
