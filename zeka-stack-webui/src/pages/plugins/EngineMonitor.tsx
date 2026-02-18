import React, { useEffect, useState } from 'react';
import { 
    Activity, 
    Bot, 
    Box, 
    ChevronLeft, 
    Cloud, 
    Cpu, 
    Network, 
    Server, 
    Shield, 
    Zap 
} from 'lucide-react';
import { api } from '../../lib/api';
import type { MonitorData, ServiceNode as ApiServiceNode } from '../../lib/api';

// --- Types & Interfaces ---

interface ThemeColor {
    primary: string; // Text & Icons
    border: string;
    bg: string;
    shadow: string;
    glow: string;
}

// Extended Node Interface for Component
interface ServiceNode extends Omit<ApiServiceNode, 'icon'> {
    icon: React.ElementType;
    subNodes?: ServiceNode[];
    theme: ThemeColor; // Pre-calculated theme
}

interface ServiceStatus {
    id: string;
    name: string;
    history: ('online' | 'offline' | 'warning' | 'idle')[];
}

// --- Color Themes ---
const THEMES: Record<string, ThemeColor> = {
    purple: {
        primary: 'text-purple-400',
        border: 'border-purple-500/30',
        bg: 'bg-purple-900/10',
        shadow: 'shadow-purple-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
    },
    cyan: {
        primary: 'text-cyan-400',
        border: 'border-cyan-500/30',
        bg: 'bg-cyan-900/10',
        shadow: 'shadow-cyan-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
    },
    blue: {
        primary: 'text-blue-400',
        border: 'border-blue-500/30',
        bg: 'bg-blue-900/10',
        shadow: 'shadow-blue-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'
    },
    emerald: {
        primary: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-900/10',
        shadow: 'shadow-emerald-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
    },
    orange: {
        primary: 'text-orange-400',
        border: 'border-orange-500/30',
        bg: 'bg-orange-900/10',
        shadow: 'shadow-orange-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
    },
    pink: {
        primary: 'text-pink-400',
        border: 'border-pink-500/30',
        bg: 'bg-pink-900/10',
        shadow: 'shadow-pink-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]'
    },
    red: {
        primary: 'text-red-400',
        border: 'border-red-500/30',
        bg: 'bg-red-900/10',
        shadow: 'shadow-red-500/20',
        glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
    }
};

// --- Helper Functions ---

const capitalize = (str: string) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
};

const getNodeTheme = (id: string, type: string): ThemeColor => {
    if (id === 'engine') return THEMES.purple;
    if (id === 'cloud') return THEMES.blue;
    if (id === 'mac-studio-m2ultra') return THEMES.emerald;
    if (type === 'gateway') return THEMES.cyan;
    if (id.includes('m4')) return THEMES.emerald;
    if (id.includes('m2')) return THEMES.orange;
    if (type === 'container') return THEMES.pink;
    return THEMES.cyan;
};

const mapIcon = (id: string, type: string): React.ElementType => {
    if (id === 'engine') return Zap;
    if (id === 'cloud') return Cloud;
    if (id.includes('proxy')) return id === 'proxy' ? Network : Shield;
    if (type === 'compute') return Cpu;
    if (type === 'container') return Box;
    if (type === 'service') return Bot;
    return Server;
};

const VALID_STATUS = new Set(['online', 'offline', 'warning', 'idle']);
const COMPUTE_ORDER = ['mac-studio-m2ultra', 'mac-m4', 'mac-m2', 'free-api'];
const MONITOR_API_TIMEOUT_MS = 5000;
const MACHINE_SHORT_NAME: Record<string, string> = {
    'mac-studio-m2ultra': 'M2U',
    'mac-m4': 'M4',
    'mac-m2': 'M2'
};

// --- Main Component ---

export const EngineMonitor: React.FC = () => {
    const [trafficActive] = useState(true);
    const [stats, setStats] = useState({
        totalTokens: 0,
        requests: 0,
        avgLatency: '0ms',
        uptime: '0%'
    });

    const [nodes, setNodes] = useState<{
        engine: ServiceNode;
        cloud: ServiceNode;
        homelab: {
            gateways: ServiceNode[];
            compute: ServiceNode[];
        }
    } | null>(null);

    // Timeline Data State
    const [statusHistory, setStatusHistory] = useState<Record<string, ServiceStatus>>({});

    // Mock Data for Fallback
    const mockData: MonitorData = {
        engine: { id: 'engine', name: 'Zeka Engine', type: 'client', status: 'online' },
        cloud: { id: 'cloud', name: 'Public Cloud', type: 'cloud', status: 'online' },
        homelab: {
            gateways: [
                { id: 'proxy', name: 'AI Proxy', type: 'gateway', status: 'online', subNodes: [], stats: [{ label: 'Req/m', value: '45' }] },
            ],
            compute: [
                {
                    id: 'mac-studio-m2ultra', name: 'Mac Studio M2 Ultra', type: 'compute', status: 'online',
                    subNodes: [
                        { id: 'cc-proxy-m2ultra', name: 'CC Proxy', type: 'service', status: 'online' },
                        { id: 'lm-studio-m2ultra', name: 'LM Studio', type: 'service', status: 'online' },
                        { id: 'ollama-m2ultra', name: 'Ollama', type: 'service', status: 'online' }
                    ]
                },
                {
                    id: 'mac-m4', name: 'Mac mini M4 Pro', type: 'compute', status: 'online',
                    subNodes: [
                        { id: 'cc-proxy', name: 'CC Proxy', type: 'service', status: 'online' },
                        { id: 'lm-studio', name: 'LM Studio', type: 'service', status: 'online' },
                        { id: 'ollama-m4', name: 'Ollama', type: 'service', status: 'online' }
                    ]
                },
                {
                    id: 'mac-m2', name: 'Mac mini M2', type: 'compute', status: 'warning',
                    subNodes: [
                        { id: 'ollama-m2', name: 'Ollama', type: 'service', status: 'offline' }
                    ]
                },
                { id: 'free-api', name: 'Free API', type: 'container', status: 'online', stats: [{ label: 'Uptime', value: '45d' }] }
            ]
        },
        stats: {
            totalTokens: 145230,
            requests: 1240,
            avgLatency: '240ms',
            uptime: '99.9%'
        }
    };

    const normalizeStatus = (status: unknown): ApiServiceNode['status'] => {
        const value = typeof status === 'string' ? status.toLowerCase() : '';
        return VALID_STATUS.has(value) ? (value as ApiServiceNode['status']) : 'idle';
    };

    const normalizeNode = (node: any, fallback: ApiServiceNode): ApiServiceNode => {
        const id = typeof node?.id === 'string' && node.id.trim() ? node.id : fallback.id;
        const name = typeof node?.name === 'string' && node.name.trim() ? node.name : fallback.name;
        const type = typeof node?.type === 'string' && node.type.trim() ? node.type : fallback.type;
        const stats = Array.isArray(node?.stats) ? node.stats : fallback.stats;
        const subNodes = Array.isArray(node?.subNodes)
            ? node.subNodes.map((sub: any) => normalizeNode(sub, {
                id: typeof sub?.id === 'string' ? sub.id : 'unknown-service',
                name: typeof sub?.name === 'string' ? sub.name : 'Unknown Service',
                type: typeof sub?.type === 'string' ? sub.type : 'service',
                status: normalizeStatus(sub?.status)
            }))
            : fallback.subNodes;

        return {
            id,
            name,
            type,
            status: normalizeStatus(node?.status ?? fallback.status),
            ...(Array.isArray(subNodes) ? { subNodes } : {}),
            ...(Array.isArray(stats) ? { stats } : {})
        };
    };

    const ensureComputeNode = (nodes: ApiServiceNode[], fallback: ApiServiceNode): ApiServiceNode[] => {
        if (nodes.some(node => node.id === fallback.id)) return nodes;
        return [...nodes, fallback];
    };

    const ensureSubServices = (node: ApiServiceNode, requiredSubs: ApiServiceNode[]): ApiServiceNode => {
        const currentSubs = Array.isArray(node.subNodes) ? [...node.subNodes] : [];
        const merged = requiredSubs.reduce((acc, required) => {
            if (acc.some(sub => sub.id === required.id)) return acc;
            acc.push(required);
            return acc;
        }, currentSubs);
        return { ...node, subNodes: merged };
    };

    const normalizeMonitorData = (input: unknown): MonitorData => {
        const raw = (input && typeof input === 'object') ? input as any : {};
        const homelab = (raw.homelab && typeof raw.homelab === 'object') ? raw.homelab : {};
        const stats = (raw.stats && typeof raw.stats === 'object') ? raw.stats : {};

        const gateways = Array.isArray(homelab.gateways)
            ? homelab.gateways.map((node: any) => normalizeNode(node, mockData.homelab.gateways[0]))
            : mockData.homelab.gateways;

        const computeRaw = Array.isArray(homelab.compute)
            ? homelab.compute.map((node: any) => normalizeNode(node, {
                id: typeof node?.id === 'string' ? node.id : 'unknown-compute',
                name: typeof node?.name === 'string' ? node.name : 'Unknown Compute',
                type: typeof node?.type === 'string' ? node.type : 'compute',
                status: normalizeStatus(node?.status)
            }))
            : mockData.homelab.compute;

        const studioRequired = mockData.homelab.compute.find(node => node.id === 'mac-studio-m2ultra')!;
        const m4Required = mockData.homelab.compute.find(node => node.id === 'mac-m4')!;
        const m2Required = mockData.homelab.compute.find(node => node.id === 'mac-m2')!;
        const freeApiRequired = mockData.homelab.compute.find(node => node.id === 'free-api')!;

        let compute = ensureComputeNode(computeRaw, studioRequired);
        compute = ensureComputeNode(compute, m4Required);
        compute = ensureComputeNode(compute, m2Required);
        compute = ensureComputeNode(compute, freeApiRequired);

        compute = compute.map(node => {
            if (node.id === 'mac-studio-m2ultra') {
                return ensureSubServices(node, studioRequired.subNodes || []);
            }
            return node;
        });

        const orderedKnown = COMPUTE_ORDER
            .map(id => compute.find(node => node.id === id))
            .filter(Boolean) as ApiServiceNode[];
        const rest = compute.filter(node => !COMPUTE_ORDER.includes(node.id));

        return {
            engine: normalizeNode(raw.engine, mockData.engine),
            cloud: normalizeNode(raw.cloud, mockData.cloud),
            homelab: {
                gateways,
                compute: [...orderedKnown, ...rest]
            },
            stats: {
                totalTokens: Number(stats.totalTokens ?? mockData.stats.totalTokens),
                requests: Number(stats.requests ?? mockData.stats.requests),
                avgLatency: typeof stats.avgLatency === 'string' ? stats.avgLatency : mockData.stats.avgLatency,
                uptime: typeof stats.uptime === 'string' ? stats.uptime : mockData.stats.uptime
            }
        };
    };

    // Helper: Initialize fake history on first load
    const initHistory = (data: MonitorData) => {
        const history: Record<string, ServiceStatus> = {};
        const rootNodes = [
            data.engine,
            data.cloud,
            ...data.homelab.gateways,
            ...data.homelab.compute
        ];

        const subNodes = data.homelab.compute.flatMap(compute => {
            const machineCode = MACHINE_SHORT_NAME[compute.id];
            return (compute.subNodes || []).map(subNode => ({
                ...subNode,
                name: machineCode ? `${subNode.name} (${machineCode})` : subNode.name
            }));
        });

        const allNodes = [...rootNodes, ...subNodes];

        allNodes.forEach(node => {
            const hist: ('online' | 'offline' | 'warning')[] = [];
            for (let i = 0; i < 40; i++) {
                const rand = Math.random();
                if (rand > 0.98) hist.push('offline');
                else if (rand > 0.95) hist.push('warning');
                else hist.push('online');
            }
            history[node.id] = { id: node.id, name: capitalize(node.name), history: hist };
        });
        return history;
    };

    // Helper: Update history with new data
    const updateHistory = (prevHistory: Record<string, ServiceStatus>, data: MonitorData) => {
        const newHistory = { ...prevHistory };
        const rootNodes = [
            data.engine,
            data.cloud,
            ...data.homelab.gateways,
            ...data.homelab.compute
        ];

        const subNodes = data.homelab.compute.flatMap(compute => {
            const machineCode = MACHINE_SHORT_NAME[compute.id];
            return (compute.subNodes || []).map(subNode => ({
                ...subNode,
                name: machineCode ? `${subNode.name} (${machineCode})` : subNode.name
            }));
        });

        const allNodes = [...rootNodes, ...subNodes];

        allNodes.forEach(node => {
            if (!newHistory[node.id]) {
                newHistory[node.id] = { id: node.id, name: capitalize(node.name), history: [] };
            }
            const status = node.status as 'online' | 'offline' | 'warning';
            const hist = [...newHistory[node.id].history, status];
            if (hist.length > 40) hist.shift();
            newHistory[node.id].history = hist;
        });
        return newHistory;
    };

    // Transform API data to Component data
    const transformData = (data: MonitorData) => {
        function transformNode(node: ApiServiceNode): ServiceNode {
            const safeId = typeof node.id === 'string' && node.id ? node.id : 'unknown-node';
            const safeType = typeof node.type === 'string' && node.type ? node.type : 'service';
            const safeName = typeof node.name === 'string' && node.name ? node.name : safeId;
            return {
                ...node,
                id: safeId,
                name: capitalize(safeName),
                type: capitalize(safeType) as any,
                status: normalizeStatus(node.status),
                icon: mapIcon(safeId, safeType),
                theme: getNodeTheme(safeId, safeType),
                subNodes: Array.isArray(node.subNodes) ? node.subNodes.map(transformNode) : []
            };
        }

        return {
            engine: transformNode(data.engine),
            cloud: transformNode(data.cloud),
            homelab: {
                gateways: data.homelab.gateways.map(transformNode),
                compute: data.homelab.compute.map(transformNode)
            }
        };
    };

    const fetchData = async () => {
        try {
            const data = await Promise.race<MonitorData>([
                api.getMonitorStatus(),
                new Promise<MonitorData>((_, reject) => {
                    setTimeout(() => reject(new Error('Monitor API timeout')), MONITOR_API_TIMEOUT_MS);
                })
            ]);
            const normalizedData = normalizeMonitorData(data);
            setStats({
                totalTokens: normalizedData.stats.totalTokens,
                requests: normalizedData.stats.requests,
                avgLatency: normalizedData.stats.avgLatency,
                uptime: normalizedData.stats.uptime
            });
            setNodes(transformData(normalizedData));
            
            setStatusHistory(prev => {
                if (Object.keys(prev).length === 0) return initHistory(normalizedData);
                return updateHistory(prev, normalizedData);
            });

        } catch (e) {
            console.warn("Failed to fetch monitor status, using mock data", e);
            const fallbackData = normalizeMonitorData(mockData);
            setStats({
                totalTokens: fallbackData.stats.totalTokens,
                requests: fallbackData.stats.requests,
                avgLatency: fallbackData.stats.avgLatency,
                uptime: fallbackData.stats.uptime
            });
            setNodes(transformData(fallbackData));
            
            setStatusHistory(prev => {
                if (Object.keys(prev).length === 0) return initHistory(fallbackData);
                return updateHistory(prev, fallbackData);
            });
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!nodes) {
        return (
            <div className="min-h-screen bg-[#02010a] flex flex-col items-center justify-center text-white space-y-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="text-cyan-500/60 font-mono animate-pulse">Initializing Neural Link...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#02010a] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
            
            {/* 1. Dynamic Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#02010a] via-[#050414] to-[#02010a]"></div>
                <div className="absolute bottom-[-20%] left-[-50%] right-[-50%] h-[80vh] bg-[linear-gradient(transparent_0%,rgba(60,20,100,0.1)_1px,transparent_1px),linear-gradient(90deg,transparent_0%,rgba(60,20,100,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(1000px)_rotateX(60deg)] animate-grid-move opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-30 animate-drift">
                    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
                    <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px]"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 animate-drift-reverse">
                    <div className="absolute top-[40%] left-[60%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-twinkle"></div>
            </div>

            {/* 2. HUD Header */}
            <header className="fixed top-16 left-0 right-0 h-20 bg-[#0a051e]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-10">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white group"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                            <h1 className="font-bold text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase">
                                Engine Monitor
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                            <span className="text-[10px] text-cyan-500/60 font-mono tracking-wider uppercase">System Optimal • v2.4.0</span>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 bg-black/20 p-2 px-6 rounded-full border border-white/5 backdrop-blur-md">
                    <HudStat label="Tokens" value={stats.totalTokens.toLocaleString()} unit="Tks" color="text-purple-400" />
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    <HudStat label="Requests" value={stats.requests.toLocaleString()} unit="Reqs" color="text-cyan-400" />
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    <HudStat label="Latency" value={stats.avgLatency} unit="" color="text-emerald-400" />
                </div>
            </header>

            {/* 3. Main Stage Container */}
            <div className="fixed top-36 bottom-0 left-0 right-0 overflow-y-auto overflow-x-hidden scrollbar-hide z-10">
                <div className="min-h-full w-full flex flex-col items-center justify-center py-4 gap-4">
                
                {/* 3.1 Topology Graph Section */}
                <div className="w-full max-w-6xl relative flex-shrink-0 transition-transform duration-500">
                    <div className="flex items-center justify-center w-full gap-4 md:gap-8 xl:gap-12">
                        
                        {/* COL 1: Engine (User) */}
                        <div className="flex flex-col items-center justify-center relative group z-30 flex-shrink-0">
                            <div className="absolute bottom-[-30px] w-24 h-8 bg-purple-500/30 rounded-[100%] blur-lg opacity-60 group-hover:scale-125 transition-transform duration-500"></div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse-slow"></div>
                                <NodeCard node={nodes.engine} size="lg" pulse />
                            </div>
                        </div>

                        {/* Connection 1 */}
                        <ConnectionSegment active={trafficActive} gradient="from-transparent via-amber-400 to-transparent" variant="soft" className="z-0 w-24 xl:w-32" />

                        {/* COL 2: Cloud */}
                        <div className="flex flex-col items-center justify-center relative z-30 flex-shrink-0">
                            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse-slow delay-700"></div>
                            <NodeCard node={nodes.cloud} size="md" />
                        </div>

                        {/* Connection 2 */}
                        <ConnectionSegment active={trafficActive} gradient="from-transparent via-rose-400 to-transparent" delay={0.5} variant="soft" className="z-20 w-24 xl:w-32" />

                        {/* COL 3: Homelab Container */}
                        <div className="relative group z-10 flex-shrink-0">
                            <div className="absolute -inset-6 bg-[#0a051e]/40 backdrop-blur-md rounded-2xl border border-white/5 [clip-path:polygon(20px_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%,0_20px)] shadow-2xl -z-10"></div>
                            <div className="absolute top-[-24px] right-[-24px] w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg z-20"></div>
                            <div className="absolute bottom-[-24px] left-[-24px] w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg z-20"></div>
                            <div className="absolute top-[-36px] left-0 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm backdrop-blur-sm z-20">
                                Homelab :: Secure Zone
                            </div>

                            <div className="relative z-20 grid grid-cols-[auto_1fr] gap-8 xl:gap-12 items-center p-4">
                                <div className="flex flex-col gap-8 relative">
                                    {nodes.homelab.gateways.map((node, idx) => (
                                        <div key={node.id} className="relative">
                                            <NodeCard node={node} size="sm" />
                                            <div className="absolute top-1/2 -right-12 w-12 h-[3px] bg-white/10 overflow-hidden rounded-full">
                                                <div 
                                                    className={`absolute inset-0 w-full bg-gradient-to-r from-transparent ${idx % 2 === 0 ? 'via-emerald-400' : 'via-orange-400'} to-transparent opacity-80 animate-data-stream-smooth`} 
                                                    style={{ animationDelay: `${idx * 0.2}s` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="absolute right-[-24px] top-6 bottom-6 w-[2px] bg-white/5 rounded-full"></div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {nodes.homelab.compute.map((node) => (
                                        <ComputeRackCard key={node.id} node={node} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3.2 Service Status Timeline List */}
                <div className="w-full max-w-6xl backdrop-blur-md bg-black/20 border border-white/5 rounded-2xl overflow-hidden p-4 relative z-30">
                    <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
                        <h3 className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            Live Availability Status
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>Operational</div>
                            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-sm"></span>Degraded</div>
                            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-sm"></span>Outage</div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {Object.values(statusHistory).map((service) => (
                            <div key={service.id} className="flex items-center gap-4 group hover:bg-white/5 py-1 px-3 rounded-lg transition-colors">
                                <div className="w-32 flex-shrink-0">
                                    <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{service.name}</div>
                                </div>
                                <div className="flex-1 flex items-center gap-[4px] h-5 px-2">
                                    {service.history.map((status, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`
                                                flex-1 h-[12px] rounded-[2px] opacity-80 hover:opacity-100 transition-all hover:scale-y-125 cursor-help relative group/tooltip
                                                ${status === 'online' ? 'bg-emerald-500/80 shadow-[0_0_4px_rgba(16,185,129,0.4)]' : 
                                                  status === 'warning' ? 'bg-orange-500/80 shadow-[0_0_4px_rgba(249,115,22,0.4)]' : 
                                                  'bg-red-500/80 shadow-[0_0_4px_rgba(239,68,68,0.4)]'}
                                            `}
                                        >
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/10 rounded text-[10px] whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none z-50">
                                                {status.toUpperCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-16 text-right">
                                    <div className={`text-xs font-bold ${
                                        service.history[service.history.length - 1] === 'online' ? 'text-emerald-400' :
                                        service.history[service.history.length - 1] === 'warning' ? 'text-orange-400' : 'text-red-400'
                                    }`}>
                                        {service.history[service.history.length - 1] === 'online' ? 'OK' : 
                                         service.history[service.history.length - 1] === 'warning' ? 'SLOW' : 'DOWN'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
};

// --- Sub Components ---

const HudStat = ({ label, value, unit, color }: any) => (
    <div className="flex flex-col items-start min-w-[100px]">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold font-mono ${color} tracking-tight`}>{value}</span>
            <span className="text-[10px] text-gray-600 font-bold">{unit}</span>
        </div>
    </div>
);

const ConnectionSegment = ({ active, gradient, delay = 0, className = '', variant = 'default' }: { active: boolean, gradient: string, delay?: number, className?: string, variant?: 'default' | 'tech' | 'soft' }) => (
    <div className={`flex-none h-[4px] mx-4 relative overflow-hidden self-center rounded-full ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded-full"></div>
        {active && (
            <div 
                className={`absolute top-0 bottom-0 w-full ${variant === 'tech' ? 'animate-data-stream-fast' : variant === 'soft' ? 'animate-data-stream-soft' : 'animate-data-stream'} z-10`}
                style={{ animationDelay: `${delay}s` }}
            >
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} ${variant === 'soft' ? 'opacity-40 blur-[10px]' : 'opacity-80 blur-[6px]'}`}></div>
                <div className={`${variant === 'soft' ? 'absolute inset-y-[1.5px] inset-x-0 bg-white/40 blur-[2px] shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'absolute inset-y-[1px] inset-x-0 bg-white/90 blur-[1px] shadow-[0_0_18px_rgba(255,255,255,0.75)]'}`}></div>
                {variant === 'tech' ? (
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-stream-head"></div>
                ) : variant === 'soft' ? (
                    <div className="absolute inset-0 bg-white/10 rounded-full animate-stream-glow-soft"></div>
                ) : (
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-stream-glow"></div>
                )}
            </div>
        )}
    </div>
);

const StatusDot = ({ status }: { status: any }) => {
    const color = status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                : status === 'offline' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                : 'bg-orange-500 shadow-[0_0_8px_#f97316]';
    return (
        <span className={`w-2 h-2 rounded-full ${color} ${status === 'online' ? 'animate-pulse' : ''}`} />
    );
};

const NodeCard = ({ node, size = 'md', pulse = false }: { node: ServiceNode, size?: 'sm' | 'md' | 'lg', pulse?: boolean }) => {
    const { theme } = node;
    const isOffline = node.status === 'offline';
    const primaryStat = node.stats?.[0];
    const sizeClasses = {
        sm: 'w-48 p-3 min-h-[100px]',
        md: 'w-56 p-5 min-h-[140px]',
        lg: 'w-64 p-6 min-h-[160px]'
    };
    const iconSizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-10 h-10' };

    return (
        <div className={`
            relative ${sizeClasses[size]}
            backdrop-blur-xl rounded-2xl border transition-all duration-300 group
            ${isOffline ? 'bg-red-900/10 border-red-500/30' : `${theme.bg} ${theme.border}`}
            hover:-translate-y-1 hover:border-opacity-60
            ${theme.glow}
        `}>
            <div className="absolute top-3 right-3">
                <StatusDot status={node.status} />
            </div>
            <div className="flex flex-col items-center text-center h-full justify-center gap-3">
                <div className={`
                    p-3 rounded-full border border-white/5 shadow-inner
                    ${isOffline ? 'bg-red-500/10 text-red-400' : 'bg-black/20 ' + theme.primary}
                    ${pulse ? 'animate-bounce-slow' : ''}
                `}>
                    <node.icon className={iconSizes[size]} />
                </div>
                <div>
                    <h3 className={`font-bold tracking-wide ${isOffline ? 'text-gray-400' : 'text-gray-100'}`}>
                        {node.name}
                    </h3>
                    <p className={`text-[10px] uppercase tracking-widest mt-1 opacity-60 ${theme.primary}`}>
                        {node.type}
                    </p>
                </div>
                {primaryStat && (
                    <div className="flex items-center gap-2 mt-1 px-2 py-1 bg-black/30 rounded border border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase">{primaryStat.label}</span>
                        <span className="text-xs font-mono font-medium text-gray-300">{primaryStat.value}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ComputeRackCard = ({ node }: { node: ServiceNode }) => {
    const { theme } = node;
    const isOffline = node.status === 'offline';

    return (
        <div className={`
            relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02]
            ${isOffline ? 'bg-red-900/5 border-red-500/20' : `bg-[#0e0a24] ${theme.border} hover:bg-[#130d2e]`}
            ${!isOffline && theme.glow}
        `}>
            {!isOffline && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[40%] w-full animate-scanline pointer-events-none opacity-20"></div>}
            <div className="flex items-center gap-4 p-3 pr-6 relative z-10">
                <div className={`w-1 h-10 rounded-full ${isOffline ? 'bg-gray-700' : theme.bg.replace('bg-', 'bg-').replace('/10', '')}`}></div>
                <div className={`
                    p-2.5 rounded-lg border border-white/5
                    ${isOffline ? 'bg-red-500/10 text-red-500' : `${theme.bg} ${theme.primary}`}
                `}>
                    <node.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <div className="flex justify-between items-center">
                        <h4 className={`font-bold text-sm ${isOffline ? 'text-gray-500' : 'text-gray-200'}`}>
                            {node.name}
                        </h4>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border opacity-80 ${isOffline ? 'border-red-500/30 text-red-400' : `${theme.border} ${theme.primary}`}`}>
                            {node.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                {node.subNodes && node.subNodes.length > 0 && (
                    <div className="flex flex-col gap-1.5 border-l border-white/10 pl-4">
                        {node.subNodes.map(sub => (
                            <div key={sub.id} className="flex items-center gap-2 group/sub cursor-default">
                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${sub.status === 'online' ? 'bg-emerald-500 group-hover/sub:shadow-[0_0_5px_#10b981]' : 'bg-red-500'}`}></div>
                                <span className={`text-[10px] font-mono transition-colors ${sub.status === 'online' ? 'text-gray-400 group-hover/sub:text-gray-200' : 'text-red-400'}`}>
                                    {sub.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
