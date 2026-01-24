import React, {useState} from 'react';
import {
    Check,
    ChevronRight,
    Cloud,
    Code,
    Diff,
    Download,
    FileText,
    FolderTree,
    Globe,
    History,
    Monitor,
    Play,
    RefreshCw,
    Save,
    Search,
    Server,
    Settings,
    Shield,
    Star,
    Terminal
} from 'lucide-react';

export const NacosHome: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'config' | 'service'>('config');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Background Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-20 pb-32">

                {/* 1. Hero Section: Direct Value Proposition */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold mb-6">
                        <Cloud className="w-3 h-3"/>
                        <span>The Ultimate Nacos Client for IntelliJ IDEA</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        告别浏览器控制台，
                        <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            在 IDE 中掌控一切。
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        集成本地 Server 管理、远程配置编辑与服务发现于一体。
                        <br/>
                        像编辑本地文件一样修改远程 Nacos 配置，体验前所未有的微服务开发效率。
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-200/50 flex items-center gap-2 hover:-translate-y-1">
                            免费下载插件
                            <Download className="w-5 h-5"/>
                        </button>
                        <button className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                            <Play className="w-5 h-5 text-slate-400"/>
                            观看演示视频
                        </button>
                    </div>
                </div>

                {/* 2. The IDE Simulation (Visual Core) */}
                <div className="mb-32 relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-xl opacity-40 -z-10"></div>

                    {/* Mock Window */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                        {/* Toolbar */}
                        <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between select-none">
                            <div className="flex items-center gap-4 text-xs text-slate-600">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <span className="font-medium ml-2">IntelliJ IDEA - Nacos Manager</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('config')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === 'config' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Configuration
                                </button>
                                <button
                                    onClick={() => setActiveTab('service')}
                                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === 'service' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Service Discovery
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Sidebar: Tool Window */}
                            <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
                                <div className="p-2 border-b border-slate-200 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">Nacos Explorer</span>
                                    <div className="flex gap-1">
                                        <div className="p-1 hover:bg-slate-200 rounded cursor-pointer">
                                            <RefreshCw className="w-3.5 h-3.5 text-slate-500"/></div>
                                        <div className="p-1 hover:bg-slate-200 rounded cursor-pointer">
                                            <Settings className="w-3.5 h-3.5 text-slate-500"/></div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-slate-700 space-y-1">
                                    <div className="flex items-center gap-1.5 py-1 px-2 hover:bg-blue-100 rounded cursor-pointer text-blue-700 font-bold bg-blue-50">
                                        <Globe className="w-3.5 h-3.5"/>
                                        <span>Remote-Prod (192.168.1.10)</span>
                                    </div>
                                    <div className="pl-4 space-y-1">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <ChevronRight className="w-3 h-3"/>
                                            <FolderTree className="w-3.5 h-3.5 text-amber-500"/>
                                            <span>Namespaces</span>
                                        </div>
                                        <div className="pl-4 space-y-1">
                                            <div className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-200 cursor-pointer">
                                                <div className="w-3.5 h-3.5 rounded bg-purple-100 flex items-center justify-center text-[8px] font-bold text-purple-600">P</div>
                                                <span>public</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 py-1 px-2 rounded bg-blue-100/50 text-blue-700 cursor-pointer border border-blue-200/50">
                                                <div className="w-3.5 h-3.5 rounded bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">D</div>
                                                <span>dev-group</span>
                                            </div>
                                            <div className="pl-6 space-y-1 mt-1">
                                                <div className="flex items-center gap-2 text-slate-600 py-0.5">
                                                    <FileText className="w-3.5 h-3.5 text-slate-400"/>
                                                    <span>user-service.yaml</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-100/50 -mx-2 px-2 py-1 rounded">
                                                    <FileText className="w-3.5 h-3.5"/>
                                                    <span>gateway.yaml</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600 py-0.5">
                                                    <FileText className="w-3.5 h-3.5 text-slate-400"/>
                                                    <span>order.properties</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 py-1 px-2 hover:bg-slate-200 rounded cursor-pointer mt-4 opacity-70">
                                        <Monitor className="w-3.5 h-3.5"/>
                                        <span>Local-Dev (localhost:8848)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Main Area: Editor/Diff */}
                            <div className="flex-1 flex flex-col bg-white">
                                {activeTab === 'config' ? (
                                    <>
                                        {/* Editor Tabs */}
                                        <div className="flex border-b border-slate-200 bg-slate-50">
                                            <div className="px-4 py-2 bg-white border-r border-slate-200 text-xs font-medium text-blue-600 border-t-2 border-t-blue-600 flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5"/>
                                                gateway.yaml (Remote)
                                            </div>
                                            <div className="px-4 py-2 border-r border-slate-200 text-xs font-medium text-slate-500 hover:bg-white cursor-pointer flex items-center gap-2">
                                                <Diff className="w-3.5 h-3.5"/>
                                                Comparison
                                            </div>
                                        </div>

                                        {/* Editor Content */}
                                        <div className="flex-1 p-0 grid grid-cols-2 divide-x divide-slate-200">
                                            {/* Original */}
                                            <div className="bg-slate-50/30 p-4 font-mono text-sm leading-6 overflow-auto">
                                                <div className="text-slate-400 text-xs mb-2 border-b pb-1">Remote Version (Rev 102)</div>
                                                <div className="text-slate-800">
                                                    <span className="text-purple-600">server</span>:<br/>
                                                    &nbsp;&nbsp;
                                                    <span className="text-purple-600">port</span>: <span className="text-blue-600">8080</span><br/>
                                                    <span className="text-purple-600">spring</span>:<br/>
                                                    &nbsp;&nbsp;<span className="text-purple-600">cloud</span>:<br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-600">gateway</span>:<br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span className="text-purple-600">routes</span>:<br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-purple-600">id</span>: <span className="text-emerald-600">user_route</span><br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span className="text-purple-600">uri</span>: <span className="text-amber-600">lb://user-service</span><br/>
                                                    <div className="bg-red-50 -mx-4 px-4 border-l-2 border-red-400 opacity-60">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className="text-purple-600">timeout</span>: <span className="text-blue-600">3000</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Modified */}
                                            <div className="bg-white p-4 font-mono text-sm leading-6 overflow-auto">
                                                <div className="text-blue-600 text-xs mb-2 border-b pb-1 font-bold flex justify-between">
                                                    <span>Local Draft (Editing)</span>
                                                    <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded">Unsaved</span>
                                                </div>
                                                <div className="text-slate-800">
                                                    <span className="text-purple-600">server</span>:<br/>
                                                    &nbsp;&nbsp;
                                                    <span className="text-purple-600">port</span>: <span className="text-blue-600">8080</span><br/>
                                                    <span className="text-purple-600">spring</span>:<br/>
                                                    &nbsp;&nbsp;<span className="text-purple-600">cloud</span>:<br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-600">gateway</span>:<br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span className="text-purple-600">routes</span>:<br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span className="text-purple-600">id</span>: <span className="text-emerald-600">user_route</span><br/>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                    <span className="text-purple-600">uri</span>: <span className="text-amber-600">lb://user-service</span><br/>
                                                    <div className="bg-emerald-50 -mx-4 px-4 border-l-2 border-emerald-500">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <span className="text-purple-600">timeout</span>: <span className="text-blue-600">5000</span>
                                                        <span className="text-slate-400 italic">// Increased for slow db</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Bar */}
                                        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                                            <div className="text-xs text-slate-500 flex gap-2">
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Valid YAML</span>
                                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> UTF-8</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded border border-slate-300">Reset</button>
                                                <button className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm flex items-center gap-1">
                                                    <Save className="w-3 h-3"/>
                                                    Publish Config
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col">
                                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                            <div className="flex gap-4 text-sm font-medium text-slate-600">
                                                <span className="text-blue-600 border-b-2 border-blue-600 pb-1">Instances (12)</span>
                                                <span>Subscribers (4)</span>
                                            </div>
                                            <div className="relative">
                                                <Search className="w-3.5 h-3.5 absolute left-2 top-1.5 text-slate-400"/>
                                                <input type="text" placeholder="Filter IPs..." className="pl-7 pr-3 py-1 text-xs border rounded bg-white w-48"/>
                                            </div>
                                        </div>
                                        <div className="p-0">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                                <tr>
                                                    <th className="px-4 py-2 border-b">IP Address</th>
                                                    <th className="px-4 py-2 border-b">Port</th>
                                                    <th className="px-4 py-2 border-b">Weight</th>
                                                    <th className="px-4 py-2 border-b">Healthy</th>
                                                    <th className="px-4 py-2 border-b">Metadata</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr className="border-b hover:bg-blue-50/50">
                                                    <td className="px-4 py-3 font-mono">192.168.1.101</td>
                                                    <td className="px-4 py-3 font-mono">8080</td>
                                                    <td className="px-4 py-3">1.0</td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3"/> true</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-400">{'{ "version": "1.0", "region": "us-east" }'}</td>
                                                </tr>
                                                <tr className="border-b hover:bg-blue-50/50">
                                                    <td className="px-4 py-3 font-mono">192.168.1.102</td>
                                                    <td className="px-4 py-3 font-mono">8080</td>
                                                    <td className="px-4 py-3">1.0</td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3"/> true</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-400">{'{ "version": "1.0", "region": "us-west" }'}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Deep Dive Features (Bento Grid) */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">全方位的治理能力</h2>

                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-6 auto-rows-[minmax(180px,auto)]">

                        {/* 1. Local Server Management (Large) */}
                        <div className="md:col-span-4 rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Server className="w-32 h-32 text-blue-600"/>
                            </div>
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                    <Monitor className="w-6 h-6"/>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">本地生命周期托管</h3>
                                <p className="text-slate-500 mb-6 max-w-md">
                                    内置 Nacos Server
                                    下载器与启动器。支持 <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">Standalone</span> 与 <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">Cluster</span> 模式切换。不再需要手动配置环境变量，开箱即用。
                                </p>
                                <div className="flex items-center gap-3 text-xs font-mono bg-slate-50 p-2 rounded-lg w-fit border border-slate-100">
                                    <span className="text-emerald-600">● Running</span>
                                    <span className="text-slate-400">|</span>
                                    <span>Port: 8848</span>
                                    <span className="text-slate-400">|</span>
                                    <span>Ver: 2.3.2</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Version Control (Tall) */}
                        <div className="md:col-span-2 row-span-2 rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                                <History className="w-6 h-6"/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">配置版本时光机</h3>
                            <p className="text-slate-500 mb-6 text-sm">
                                所有的配置修改都会自动记录版本。支持查看历史版本差异，一键回滚到任意历史时刻。
                            </p>
                            <div className="space-y-3 relative">
                                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200"></div>
                                {[
                                    {ver: 'v3', msg: 'Update timeout', time: 'Just now', active: true},
                                    {ver: 'v2', msg: 'Add redis config', time: '2h ago', active: false},
                                    {ver: 'v1', msg: 'Initial commit', time: '1d ago', active: false},
                                ].map((item) => (
                                    <div key={item.ver} className="flex items-start gap-3 relative z-10">
                                        <div className={`w-3.5 h-3.5 rounded-full border-2 ${item.active ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'} mt-1`}></div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-700">{item.msg}</div>
                                            <div className="text-xs text-slate-400">{item.time} • {item.ver}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Intelligent Editor (Medium) */}
                        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mb-3 text-emerald-600">
                                <Code className="w-5 h-5"/>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">智能编辑器</h3>
                            <p className="text-slate-500 text-sm">
                                完整的 YAML/Properties 语法高亮、校验与自动补全。
                            </p>
                        </div>

                        {/* 4. Security (Medium) */}
                        <div className="md:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center mb-3 text-amber-600">
                                <Shield className="w-5 h-5"/>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">安全鉴权</h3>
                            <p className="text-slate-500 text-sm">
                                完美支持 Nacos 鉴权机制。AccessKey 安全加密存储。
                            </p>
                        </div>

                    </div>
                </div>

                {/* 4. Bottom CTA: Modern & Clean */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 px-8 py-16 md:py-20 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-6 border border-white/20">
                            <Star className="w-3 h-3 fill-current text-yellow-300"/>
                            <span>4.9/5.0 Rating on Marketplace</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            Ready to modernize your microservices workflow?
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of developers who manage their Nacos configuration directly from IntelliJ IDEA.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold transition-all hover:bg-blue-50 shadow-lg hover:shadow-xl flex items-center gap-2">
                                <Download className="w-5 h-5"/>
                                Install Plugin
                            </button>
                            <button className="px-8 py-4 bg-blue-800/50 hover:bg-blue-800 text-white rounded-xl font-bold transition-all border border-blue-400/30 flex items-center gap-2 backdrop-blur-sm">
                                <Terminal className="w-5 h-5"/>
                                Read Docs
                            </button>
                        </div>

                        <div className="mt-8 text-sm text-blue-200/60 font-mono">
                            Latest Version: v2024.1.2 • Compatible with IDEA 2022.3+
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
