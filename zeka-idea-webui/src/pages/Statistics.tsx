import React, {useEffect, useRef, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {
    Activity,
    BarChart3,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Code2,
    Cpu,
    FolderKanban,
    Layers,
    TrendingUp,
    Zap
} from 'lucide-react';
import {api, type EventRecord} from '../lib/api';
import {authStorage} from '../lib/auth';

const SAMPLE_DATA = {
    source: 'local-json',
    generatedAt: 1737264000000,
    records: [
        {
            id: 1,
            pluginId: 'javadoc',
            eventType: {value: 'javadoc_class', desc: 'Javadoc 生成'},
            provider: 'qianwen',
            model: 'qwen2.5-coder-7b',
            tokenCount: 820,
            inputToken: 560,
            outputToken: 260,
            latencyMs: 1830,
            resultStatus: 'success',
            userAction: 'editor_context_menu',
            clientTimestamp: 1737264000123,
            projectName: 'zeka-idea-plugin',
            deviceId: 'dev-1'
        }
    ]
};

// ... Types definitions ...
type EventStat30mDTO = {
    bucketStart: string | number;
    bucketEnd: string | number;
    deviceId: string;
    projectName: string;
    pluginId: string;
    eventType: string;
    provider: string;
    model: string;
    userAction: string;
    totalCount: number;
    successCount: number;
    failedCount: number;
    tokenTotal: number;
    inputTokenTotal: number;
    outputTokenTotal: number;
    latencyTotalMs: number;
    latencyAvgMs: number;
    latencyMaxMs: number;
    latencyMinMs: number;
};

type EventStatOverviewDTO = {
    totalCount: number;
    successCount: number;
    failedCount: number;
    tokenTotal: number;
    inputTokenTotal: number;
    outputTokenTotal: number;
    latencyAvgMs: number;
    latencyMaxMs: number;
    latencyMinMs: number;
    countByEventType: Record<string, number>;
    tokenByEventType: Record<string, number>;
    countByProvider: Record<string, number>;
    countByUserAction: Record<string, number>;
    tokenByProject: Record<string, number>;
    countByProject: Record<string, number>;
    countByDay: Record<string, number>;
    tokenByDay: Record<string, number>;
    countByDayEventType: Record<string, Record<string, number>>;
    recentBuckets: EventStat30mDTO[];
};

const StatCard = ({icon: Icon, label, value, trend, trendUp}: {
    icon: React.ComponentType<{ className?: string }>,
    label: string,
    value: string,
    trend?: string,
    trendUp?: boolean
}) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600"/>
            </div>
            {trend && (
                <span className={`text-sm font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'} flex items-center`}>
          {trendUp ? '+' : ''}{trend}
                    <TrendingUp className={`w-3 h-3 ml-1 ${!trendUp && 'rotate-180'}`}/>
        </span>
            )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
);

export const Statistics: React.FC = () => {
    const buildOverviewFromRecords = (records: any[]): EventStatOverviewDTO => {
        // ... existing fallback logic ...
        const totalCount = records.length;
        const successCount = records.filter((r) => r.resultStatus === 'success').length;
        const failedCount = totalCount - successCount;
        const tokenTotal = records.reduce((acc, r) => acc + (r.tokenCount || 0), 0);
        const inputTokenTotal = records.reduce((acc, r) => acc + (r.inputToken || 0), 0);
        const outputTokenTotal = records.reduce((acc, r) => acc + (r.outputToken || 0), 0);
        const latencyAvgMs = totalCount
            ? Math.round(records.reduce((acc, r) => acc + (r.latencyMs || 0), 0) / totalCount)
            : 0;
        const latencyMaxMs = records.reduce((max, r) => Math.max(max, r.latencyMs || 0), 0);
        const latencyMinMs = records.reduce((min, r) => Math.min(min, r.latencyMs || 0), latencyMaxMs || 0);

        const countByEventType: Record<string, number> = {};
        const tokenByEventType: Record<string, number> = {};
        const countByProvider: Record<string, number> = {};
        const countByUserAction: Record<string, number> = {};
        const tokenByProject: Record<string, number> = {};
        const countByProject: Record<string, number> = {};
        const countByDay: Record<string, number> = {};
        const tokenByDay: Record<string, number> = {};
        const countByDayEventType: Record<string, Record<string, number>> = {};
        records.forEach((r) => {
            const et = typeof r.eventType === 'object' ? r.eventType.value : r.eventType;
            countByEventType[et] = (countByEventType[et] || 0) + 1;
            tokenByEventType[et] = (tokenByEventType[et] || 0) + (r.tokenCount || 0);
            countByProvider[r.provider] = (countByProvider[r.provider] || 0) + 1;
            countByUserAction[r.userAction] = (countByUserAction[r.userAction] || 0) + 1;
            tokenByProject[r.projectName || 'unknown'] = (tokenByProject[r.projectName || 'unknown'] || 0) + (r.tokenCount || 0);
            countByProject[r.projectName || 'unknown'] = (countByProject[r.projectName || 'unknown'] || 0) + 1;
            const day = new Date(r.clientTimestamp || Date.now()).toISOString().slice(0, 10);
            countByDay[day] = (countByDay[day] || 0) + 1;
            tokenByDay[day] = (tokenByDay[day] || 0) + (r.tokenCount || 0);
            countByDayEventType[day] = countByDayEventType[day] || {};
            countByDayEventType[day][et] = (countByDayEventType[day][et] || 0) + 1;
        });

        return {
            totalCount, successCount, failedCount, tokenTotal, inputTokenTotal, outputTokenTotal,
            latencyAvgMs, latencyMaxMs, latencyMinMs, countByEventType, tokenByEventType,
            countByProvider, countByUserAction, tokenByProject, countByProject,
            countByDay, tokenByDay, countByDayEventType, recentBuckets: []
        };
    };

    const [overview, setOverview] = useState<EventStatOverviewDTO>(buildOverviewFromRecords(SAMPLE_DATA.records));
    const [recentEvents, setRecentEvents] = useState<EventRecord[]>(SAMPLE_DATA.records as any);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalEvents, setTotalEvents] = useState(SAMPLE_DATA.records.length);

    // Use ref to prevent double fetch in strict mode or rapid updates
    const overviewFetched = useRef(false);

    // Effect 1: Initialize Device ID (Once)
    useEffect(() => {
        const init = async () => {
            let id: string | null = null;
            if (import.meta.env.DEV) {
                id = import.meta.env.VITE_DEVICE_ID || null;
            }
            if (!id) {
                id = authStorage.getDeviceId();
                if (!id) {
                    const authStatus = await api.getAuthStatus();
                    if (authStatus?.loggedIn && authStatus.user?.deviceId) {
                        id = authStatus.user.deviceId;
                        authStorage.setDeviceId(id);
                    }
                }
            }
            if (!id && import.meta.env.DEV) {
                id = "8a62de8a-1d21-45aa-862a-e069140545e3";
            }
            setDeviceId(id);
        };
        init();
    }, []);

    // Effect 2: Fetch Overview (Only when deviceId is set and NOT fetched yet)
    useEffect(() => {
        if (!deviceId || overviewFetched.current) return;

        overviewFetched.current = true; // Mark as fetched
        fetch(`/api/plugin/event-stat30/overview?deviceId=${encodeURIComponent(deviceId)}`)
            .then(r => r.json())
            .then(json => {
                const data = json?.data ?? json;
                if (data && typeof data === 'object') setOverview(data);
            })
            .catch(e => console.error('Overview fetch failed', e));
    }, [deviceId]);

    // Effect 3: Fetch Events (When deviceId is set OR page changes)
    useEffect(() => {
        if (!deviceId) return;

        const fetchEvents = async () => {
            setLoadingEvents(true);
            try {
                const pageResult = await api.getRecentEvents(deviceId, currentPage, pageSize);
                setRecentEvents(pageResult.records || []);
                setTotalEvents(pageResult.total || 0);
            } catch (e) {
                console.error('Events fetch failed', e);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchEvents();
    }, [deviceId, currentPage, pageSize]);

    // Data for charts
    const chartTotalEvents = overview.totalCount;
    const successRate = chartTotalEvents ? Math.round((overview.successCount / chartTotalEvents) * 100) : 0;
    const totalTokens = overview.tokenTotal;
    const avgLatency = overview.latencyAvgMs;
    const byEventType = overview.countByEventType || {};
    const byProvider = overview.countByProvider || {};
    const byUserAction = overview.countByUserAction || {};
    const byProjectTokens = overview.tokenByProject || {};
    const byDay = overview.countByDay || {};
    const byDayTokens = overview.tokenByDay || {};
    const dayKeys = Object.keys(byDay).sort();

    const formatDateTime = (value: string | number) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';

        const Y = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');

        return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    };

    const totalPages = Math.ceil(totalEvents / pageSize);

    // --- ECharts Options Generators ---
    // ... (Charts options logic same as before) ...
    const getDailyTrendOption = () => ({
        tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
        legend: {data: ['Token Consumption', 'Event Count']},
        grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
        xAxis: {type: 'category', data: dayKeys.map(d => d.slice(5)), axisLine: {lineStyle: {color: '#9CA3AF'}}},
        yAxis: [
            {
                type: 'value',
                name: 'Tokens',
                position: 'left',
                axisLine: {show: true, lineStyle: {color: '#8B5CF6'}},
                axisLabel: {color: '#8B5CF6'}
            },
            {
                type: 'value',
                name: 'Events',
                position: 'right',
                axisLine: {show: true, lineStyle: {color: '#6366F1'}},
                axisLabel: {color: '#6366F1'}
            }
        ],
        series: [
            {
                name: 'Token Consumption',
                type: 'line',
                smooth: true,
                yAxisIndex: 0,
                data: dayKeys.map(d => byDayTokens[d] || 0),
                itemStyle: {color: '#8B5CF6'},
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{offset: 0, color: 'rgba(139, 92, 246, 0.3)'}, {offset: 1, color: 'rgba(139, 92, 246, 0)'}]
                    }
                }
            },
            {
                name: 'Event Count',
                type: 'bar',
                yAxisIndex: 1,
                data: dayKeys.map(d => byDay[d] || 0),
                itemStyle: {color: '#6366F1', borderRadius: [4, 4, 0, 0]},
                barMaxWidth: 30
            }
        ]
    });

    const getPieOption = (data: Record<string, number>, title: string) => ({
        tooltip: {trigger: 'item', formatter: '{b}: {c} ({d}%)'},
        legend: {bottom: '0%', left: 'center'},
        series: [{
            name: title,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {borderRadius: 10, borderColor: '#fff', borderWidth: 2},
            label: {show: false, position: 'center'},
            emphasis: {label: {show: true, fontSize: 14, fontWeight: 'bold'}},
            data: Object.entries(data).map(([k, v]) => ({value: v, name: k}))
        }]
    });

    const getBarOption = (data: Record<string, number>, title: string, color: string) => {
        const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
        return {
            tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
            grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
            xAxis: {type: 'value'},
            yAxis: {type: 'category', data: sortedData.map(item => item[0]), axisLabel: {width: 100, overflow: 'truncate'}},
            series: [{
                name: title,
                type: 'bar',
                data: sortedData.map(item => item[1]),
                itemStyle: {color: color, borderRadius: [0, 4, 4, 0]},
                label: {show: true, position: 'right'}
            }]
        };
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-indigo-600"/>
                        Statistics Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm flex items-center gap-2">
                        <span>Connected Device: <span className="font-mono bg-gray-100 px-1 rounded">{deviceId || 'None'}</span></span>
                    </p>
                </div>

                {/* 1. Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Code2} label="Total Events" value={`${chartTotalEvents}`} trend="12%" trendUp={true}/>
                    <StatCard icon={Zap} label="Success Rate" value={`${successRate}%`} trend={successRate >= 90 ? "Stable" : "Attention"} trendUp={successRate >= 90}/>
                    <StatCard icon={Clock} label="Avg Latency" value={`${avgLatency} ms`}/>
                    <StatCard icon={Calendar} label="Total Tokens" value={(totalTokens / 1000).toFixed(1) + 'k'}/>
                </div>

                {/* 2. Charts Section */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600"/> Activity Trend
                    </h3>
                    <ReactECharts option={getDailyTrendOption()} style={{height: '350px'}}/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-600"/> Event Type</h3>
                        <ReactECharts option={getPieOption(byEventType, 'Event Type')} style={{height: '300px'}}/>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-indigo-600"/> Provider Usage</h3>
                        <ReactECharts option={getPieOption(byProvider, 'Provider')} style={{height: '300px'}}/>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FolderKanban className="w-5 h-5 text-indigo-600"/> Project Token Usage</h3>
                        <ReactECharts option={getBarOption(byProjectTokens, 'Tokens', '#8B5CF6')} style={{height: '300px'}}/>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600"/> Entry Point Usage</h3>
                        <ReactECharts option={getBarOption(byUserAction, 'Actions', '#6366F1')} style={{height: '300px'}}/>
                    </div>
                </div>

                {/* 3. Recent Records Table */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            Recent Activity Log
                            {loadingEvents && <span className="animate-spin text-indigo-600 ml-2"><Zap className="w-4 h-4"/></span>}
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-400">
                                Page {currentPage} of {totalPages || 1} ({totalEvents} total)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage <= 1 || loadingEvents}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600"/>
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages || loadingEvents}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto min-h-[200px]">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="text-left py-3 px-4 rounded-l-lg">Time</th>
                                <th className="text-left py-3 px-4">Type</th>
                                <th className="text-left py-3 px-4">Provider/Model</th>
                                <th className="text-left py-3 px-4">Latency</th>
                                <th className="text-left py-3 px-4">Tokens</th>
                                <th className="text-left py-3 px-4">Project</th>
                                <th className="text-left py-3 px-4 rounded-r-lg">Status</th>
                            </tr>
                            </thead>
                            <tbody className={`text-gray-700 divide-y divide-gray-100 transition-opacity duration-200 ${loadingEvents ? 'opacity-50' : 'opacity-100'}`}>
                            {recentEvents.map((item, idx) => (
                                <tr key={`${item.id || idx}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{formatDateTime(item.clientTimestamp)}</td>
                                    <td className="py-3 px-4 font-medium">
                                        {typeof item.eventType === 'object' ? item.eventType.desc : item.eventType}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{item.provider}</span> {item.model}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">{item.latencyMs} ms</td>
                                    <td className="py-3 px-4">{item.tokenCount}</td>
                                    <td className="py-3 px-4 text-gray-500">{item.projectName}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                            item.resultStatus !== 'success' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {item.resultStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentEvents.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400">No events found</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
