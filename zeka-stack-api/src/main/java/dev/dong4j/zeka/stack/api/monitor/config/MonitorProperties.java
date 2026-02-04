package dev.dong4j.zeka.stack.api.monitor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "monitor")
public class MonitorProperties {
    private List<NodeConfig> nodes = new ArrayList<>();

    @Data
    public static class NodeConfig {
        private String id;
        private String name;
        private String type; // client, cloud, gateway, compute, service, container
        private String host;
        private Integer port;
        private String checkType; // ping, tcp, http
        private String group; // homelab.gateways, homelab.compute
        private String parentId; // for nested services
    }
}
