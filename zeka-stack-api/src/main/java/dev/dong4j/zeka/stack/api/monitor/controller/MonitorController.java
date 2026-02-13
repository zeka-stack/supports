package dev.dong4j.zeka.stack.api.monitor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.dong4j.zeka.kernel.common.api.R;
import dev.dong4j.zeka.kernel.common.api.Result;
import dev.dong4j.zeka.stack.api.monitor.model.MonitorData;
import dev.dong4j.zeka.stack.api.monitor.service.MonitorService;
import lombok.RequiredArgsConstructor;

/**
 * 监控控制器
 * <p> 提供系统监控相关的接口, 用于获取系统运行状态和监控数据
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.02.13
 * @since 1.0.0
 */
@RestController
@RequestMapping("/monitor")
@RequiredArgsConstructor
public class MonitorController {

    /** 监控服务 */
    private final MonitorService monitorService;

    /**
     * 获取系统监控状态
     * <p> 查询并返回当前的监控数据
     *
     * @return 包含监控数据的操作结果对象
     */
    @GetMapping("/status")
    public Result<MonitorData> getStatus() {
        return R.succeed(monitorService.getMonitorData());
    }
}
