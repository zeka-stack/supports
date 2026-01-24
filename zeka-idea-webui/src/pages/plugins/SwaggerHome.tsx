import React, {useState} from 'react';
import {ArrowRight, Box, Braces, Code2, Copy, FileJson, Globe, Play, Server, Settings, Terminal, Zap} from 'lucide-react';

export const SwaggerHome: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    // Simulate API Request Animation
    const handleSend = () => {
        setRequestStatus('loading');
        setTimeout(() => {
            setRequestStatus('success');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-slate-300 font-sans selection:bg-amber-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-20 pb-20">

                {/* 1. Header Section */}
                <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-6">
                            <Globe className="w-3 h-3"/>
                            <span>API First Development</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                            Instant <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                Open API Spec.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            从 Java 代码直接生成 Swagger/OpenAPI 文档。
                            <br/>
                            内置现代化调试器，让 IDEA 变身 Postman，接口开发从未如此流畅。
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 border border-slate-700">
                            <FileJson className="w-4 h-4 text-amber-500"/>
                            Export JSON
                        </button>
                        <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2">
                            安装插件
                            <ArrowRight className="w-4 h-4"/>
                        </button>
                    </div>
                </div>

                {/* 2. Interactive API Console (The "Hero" Visual) */}
                <div className="rounded-2xl border border-slate-800 bg-[#131316] shadow-2xl overflow-hidden mb-24">
                    {/* Console Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1e] border-b border-slate-800">
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded text-xs text-slate-400 border border-slate-700/50">
                                <Server className="w-3 h-3"/>
                                <span>dev-environment</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded text-xs text-slate-400 border border-slate-700/50">
                                <Settings className="w-3 h-3"/>
                                <span>config.json</span>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                        {/* Sidebar: Endpoints */}
                        <div className="lg:col-span-3 border-r border-slate-800 bg-[#161619] p-4 hidden lg:block">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pl-2">Endpoints</div>
                            <div className="space-y-1">
                                {[
                                    {method: 'GET', path: '/users', active: false},
                                    {method: 'POST', path: '/users/create', active: true},
                                    {method: 'GET', path: '/products', active: false},
                                    {method: 'DELETE', path: '/orders/{id}', active: false},
                                ].map((ep, i) => (
                                    <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${ep.active ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-slate-800/50'}`}>
                                        <span className={`text-[10px] font-bold w-10 ${
                                            ep.method === 'GET' ? 'text-blue-400' :
                                                ep.method === 'POST' ? 'text-emerald-400' :
                                                    ep.method === 'DELETE' ? 'text-red-400' : 'text-slate-400'
                                        }`}>{ep.method}</span>
                                        <span className={`text-sm truncate ${ep.active ? 'text-amber-100' : 'text-slate-400'}`}>{ep.path}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main: Request/Response */}
                        <div className="lg:col-span-9 flex flex-col">
                            {/* URL Bar */}
                            <div className="p-4 border-b border-slate-800 flex gap-3">
                                <div className="flex-1 flex bg-[#0c0c0e] border border-slate-700 rounded-lg overflow-hidden items-center">
                                    <span className="px-3 py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border-r border-emerald-500/20">POST</span>
                                    <span className="flex-1 px-3 text-sm text-slate-300 font-mono">https://api.zeka.io/v1/users/create</span>
                                </div>
                                <button
                                    onClick={handleSend}
                                    className="px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    {requestStatus === 'loading' ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <Play className="w-4 h-4 fill-current"/>
                                    )}
                                    Send
                                </button>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                                {/* Left: Request Body */}
                                <div className="border-r border-slate-800 p-4">
                                    <div className="flex gap-4 mb-4 border-b border-slate-800/50 pb-2">
                                        {['Params', 'Headers', 'Body'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                                                className={`text-xs font-bold pb-2 transition-colors ${activeTab === tab.toLowerCase() ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="font-mono text-sm text-slate-400 leading-6">
                                        <div className="text-slate-500">{'// Request Body (JSON)'}</div>
                                        <div className="text-yellow-500">{'{'}</div>
                                        <div className="pl-4">
                                            <span className="text-sky-400">"username"</span>: <span className="text-emerald-400">"dong4j"</span>,
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-sky-400">"role"</span>: <span className="text-emerald-400">"admin"</span>,
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-sky-400">"features"</span>: <span className="text-yellow-500">['beta', 'pro']</span>
                                        </div>
                                        <div className="text-yellow-500">{'}'}</div>
                                    </div>
                                </div>

                                {/* Right: Response */}
                                <div className="bg-[#0c0c0e] p-4 relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-xs font-bold text-slate-500 uppercase">Response</div>
                                        {requestStatus === 'success' && (
                                            <div className="flex gap-3 text-xs">
                                                <span className="text-emerald-400">200 OK</span>
                                                <span className="text-slate-500">145ms</span>
                                                <span className="text-slate-500">1.2KB</span>
                                            </div>
                                        )}
                                    </div>

                                    {requestStatus === 'idle' && (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                                            <Zap className="w-10 h-10 opacity-20"/>
                                            <span className="text-xs">Click Send to trigger request</span>
                                        </div>
                                    )}

                                    {requestStatus === 'loading' && (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                                        </div>
                                    )}

                                    {requestStatus === 'success' && (
                                        <div className="font-mono text-sm text-slate-300 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="text-yellow-500">{'{'}</div>
                                            <div className="pl-4">
                                                <span className="text-sky-400">"status"</span>: <span className="text-emerald-400">"success"</span>,
                                            </div>
                                            <div className="pl-4">
                                                <span className="text-sky-400">"data"</span>: {'{'}
                                            </div>
                                            <div className="pl-8">
                                                <span className="text-sky-400">"id"</span>: <span className="text-orange-400">1024</span>,
                                            </div>
                                            <div className="pl-8">
                                                <span className="text-sky-400">"token"</span>: <span className="text-emerald-400">"eyJhbGci..."</span>
                                            </div>
                                            <div className="pl-4">{'}'}</div>
                                            <div className="text-yellow-500">{'}'}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Feature Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Annotation Free */}
                    <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-amber-500/30 transition-all group">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code2 className="w-6 h-6 text-amber-500"/>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">零侵入生成</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            直接解析 JavaDoc 与 Controller 代码逻辑。无需添加繁琐的 `@Operation` 或 `@Api` 注解，保持代码纯净。
                        </p>
                    </div>

                    {/* Card 2: Environment Sync */}
                    <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-orange-500/30 transition-all group">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Box className="w-6 h-6 text-orange-500"/>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">多环境管理</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            一键切换 Dev/Test/Prod 环境变量。自动同步 Authorization Header，告别手动复制 Token 的痛苦。
                        </p>
                    </div>

                    {/* Card 3: Export & Share */}
                    <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-red-500/30 transition-all group">
                        <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Terminal className="w-6 h-6 text-red-500"/>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">格式兼容</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            完美支持 OpenAPI 3.0 与 Swagger 2.0 标准。支持导出为 Markdown、HTML 或 Postman Collection。
                        </p>
                    </div>
                </div>

                {/* 4. Bottom Code Snippet */}
                <div className="mt-24 border-t border-slate-800 pt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-500 mb-6 font-mono text-sm">
                        <Braces className="w-4 h-4"/>
                        <span>Configured via simple annotations if needed</span>
                    </div>
                    <div className="max-w-3xl mx-auto bg-[#161619] border border-slate-800 rounded-xl p-6 text-left shadow-2xl relative group">
                        <div className="absolute top-4 right-4 text-slate-600 group-hover:text-amber-500 cursor-pointer transition-colors">
                            <Copy className="w-4 h-4"/>
                        </div>
                        <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                            <span className="text-purple-400">@RestController</span><br/>
                            <span className="text-purple-400">@RequestMapping</span>(<span className="text-emerald-400">"/api/v1"</span>)<br/>
                            <span className="text-amber-500">public class</span> <span className="text-blue-400">OrderController</span> {'{'}<br/><br/>
                            &nbsp;&nbsp;
                            <span className="text-slate-500">/**<br/>&nbsp;&nbsp; * Create a new order with items<br/>&nbsp;&nbsp; */</span><br/>
                            &nbsp;&nbsp;
                            <span className="text-purple-400">@PostMapping</span>(<span className="text-emerald-400">"/orders"</span>)<br/>
                            &nbsp;&nbsp;<span className="text-amber-500">public</span> <span className="text-blue-400">Result</span>&lt;
                            <span className="text-blue-400">Order</span>&gt; create(<span className="text-purple-400">@RequestBody</span> <span className="text-blue-400">OrderDTO</span> dto) {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Zeka automatically generates specs from this signature</span><br/>
                            &nbsp;&nbsp;{'}'}<br/>
                            {'}'}
                        </pre>
                    </div>
                </div>

            </div>
        </div>
    );
};
