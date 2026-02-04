package dev.dong4j.zeka.stack.api.monitor.model;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ServiceNode {
    private String id;
    private String name;
    private String type;
    private String status;
    private List<ServiceNode> subNodes;
    private List<StatItem> stats;

    @Data
    @Builder
    public static class StatItem {
        private String label;
        private String value;
    }
}
