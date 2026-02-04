package dev.dong4j.zeka.stack.api.monitor.controller;

import dev.dong4j.zeka.kernel.common.api.R;
import dev.dong4j.zeka.kernel.common.api.Result;
import dev.dong4j.zeka.stack.api.monitor.model.MonitorData;
import dev.dong4j.zeka.stack.api.monitor.service.MonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/monitor")
@RequiredArgsConstructor
public class MonitorController {

    private final MonitorService monitorService;

    @GetMapping("/status")
    public Result<MonitorData> getStatus() {
        return R.succeed(monitorService.getMonitorData());
    }
}
