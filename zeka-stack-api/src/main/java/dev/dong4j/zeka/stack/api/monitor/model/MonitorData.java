package dev.dong4j.zeka.stack.api.monitor.model;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MonitorData {
    private ServiceNode engine;
    private ServiceNode cloud;
    private HomelabData homelab;
    private GlobalStats stats;

    @Data
    @Builder
    public static class HomelabData {
        private List<ServiceNode> gateways;
        private List<ServiceNode> compute;
    }

    @Data
    @Builder
    public static class GlobalStats {
        private long totalTokens;
        private long requests;
        private String avgLatency;
        private String uptime;
    }
}
