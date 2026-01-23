import React, {useEffect, useState} from 'react';
import {Activity, Bot, Cpu, Database, Globe, Layers, Lock, Network, Settings, Sparkles, Zap} from 'lucide-react';

export const EngineHome: React.FC = () => {
    // Animation state for data flow
    const [activePulse, setActivePulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActivePulse((prev) => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-violet-500/30 overflow-x-hidden">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            </div>

            {/* Hero Section: The Core - Content Shifted Up */}
            <section className="relative pt-20 pb-10 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/50 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-fade-in-up">
                        <Cpu className="w-4 h-4 text-violet-400"/>
                        <span>Core Intelligence Infrastructure</span>
                    </div>

                    {/* Main Title - Clean, Bold and Professional */}
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 animate-fade-in-up delay-100">
                        <span className="text-white">IntelliAI </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            Engine
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-violet-200/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up delay-200">
                        统一的 AI 服务编排层。连接 IDE 与无限智能，
                        为 Zeka 家族插件提供标准化的神经动力。
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                        <button className="relative px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] flex items-center gap-3 group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient-x"></div>
                            <span className="relative flex items-center gap-2">
                                <Zap className="w-5 h-5 fill-current"/>
                                接入 Engine SDK
                            </span>
                        </button>
                        <button className="px-8 py-3.5 bg-[#1a103c]/30 hover:bg-[#1a103c]/60 border border-violet-500/20 text-violet-200 rounded-xl font-bold transition-all flex items-center gap-3 backdrop-blur-sm">
                            <Settings className="w-5 h-5"/>
                            查看配置
                        </button>
                    </div>
                </div>

                {/* Animated Core Visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none -z-10 opacity-40">
                    <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-[60px] rounded-full border border-fuchsia-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 bg-violet-600/10 rounded-full blur-[80px] animate-pulse"></div>
                </div>
            </section>

            {/* Neural Network Connection Diagram - Tightened spacing */}
            <section className="py-12 bg-[#050511] relative border-y border-violet-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                            全景智能调度矩阵
                        </h2>
                        <p className="text-violet-300/50 max-w-xl mx-auto text-sm">
                            屏蔽模型差异，实现业务插件与 AI 能力的深度解耦与高效协同。
                        </p>
                    </div>

                    {/* Diagram Container */}
                    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch min-h-[350px]">
                        {/* Left: Consumers (Plugins) */}
                        <div className="flex flex-col justify-center space-y-4 relative z-10">
                            <div className="text-[10px] font-mono text-cyan-500/60 text-center mb-2 tracking-[0.2em] uppercase">Consumers</div>
                            {['Repairer', 'Tracer', 'Javadoc', 'Changelog'].map((plugin, idx) => (
                                <div key={plugin} className="group relative p-3 bg-[#0f0e24]/60 border border-violet-500/10 rounded-lg hover:border-cyan-400/40 transition-all cursor-default overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center justify-between relative z-10 px-2">
                                        <span className="font-mono text-xs text-cyan-100/80">{plugin} Plugin</span>
                                        <Activity className={`w-3 h-3 text-cyan-500 ${idx === activePulse ? 'animate-ping' : ''}`}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Center: The Engine (Processing) */}
                        <div className="relative flex flex-col items-center justify-center z-20 my-8 lg:my-0">
                            <div className="relative w-48 h-48 bg-[#0a051e] border border-violet-500/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-xl group">
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/20 animate-[spin_30s_linear_infinite]"></div>
                                <Cpu className="w-14 h-14 text-violet-400 mb-3 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"/>
                                <h3 className="text-sm font-bold text-white tracking-[0.2em]">ENGINE</h3>
                                <span className="text-[10px] text-violet-400 mt-1 font-mono bg-violet-900/20 px-2 py-0.5 rounded">Active</span>
                            </div>

                            {/* Connecting Lines SVG */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block overflow-visible">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(6,182,212,0.05)"/>
                                        <stop offset="50%" stopColor="rgba(139,92,246,0.3)"/>
                                        <stop offset="100%" stopColor="rgba(236,72,153,0.05)"/>
                                    </linearGradient>
                                </defs>
                                <path d="M0,60 C100,60 100,175 180,175" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                                <path d="M0,130 C100,130 100,175 180,175" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                                <path d="M0,220 C100,220 100,175 180,175" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                                <path d="M0,290 C100,290 100,175 180,175" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                                <path d="M300,175 C380,175 380,80 480,80" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                                <path d="M300,175 C380,175 380,175 480,175" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                                <path d="M300,175 C380,175 380,270 480,270" fill="none" stroke="url(#lineGradient)" strokeWidth="1"/>
                            </svg>
                        </div>

                        {/* Right: Providers (LLMs) */}
                        <div className="flex flex-col justify-center space-y-4 relative z-10">
                            <div className="text-[10px] font-mono text-fuchsia-500/60 text-center mb-2 tracking-[0.2em] uppercase">Providers</div>
                            {[
                                {name: 'OpenAI GPT-4', icon: Globe, color: 'text-green-500'},
                                {name: 'Aliyun Qwen', icon: Database, color: 'text-orange-500'},
                                {name: 'Local Ollama', icon: Bot, color: 'text-blue-500'},
                            ].map((provider) => (
                                <div key={provider.name} className="group relative p-3 bg-[#0f0e24]/60 border border-violet-500/10 rounded-lg hover:border-fuchsia-400/40 transition-all cursor-default">
                                    <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-3 relative z-10 px-2">
                                        <provider.icon className={`w-4 h-4 ${provider.color} opacity-70`}/>
                                        <span className="font-mono text-xs text-fuchsia-100/80">{provider.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Ecosystem & Providers Section */}
            <section className="py-24 bg-[#04010e] relative overflow-hidden border-t border-violet-900/20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/20 border border-violet-500/20 text-violet-300 text-xs font-bold mb-6">
                            <Sparkles className="w-3 h-3 text-yellow-400"/>
                            <span>Freedom of Choice</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            连接 80+ 主流 AI 服务商
                        </h2>
                        <p className="text-violet-200/50 max-w-2xl mx-auto leading-relaxed">
                            无论是云端巨头还是本地私有化模型，Engine 均提供原生级支持。
                            <br/>
                            打破厂商锁定，一键自由切换最强模型。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: OpenAI Compatible */}
                        <div className="p-8 rounded-2xl bg-[#0a0616] border border-white/5 hover:border-emerald-500/30 hover:bg-[#0c081a] transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                    <Globe className="w-6 h-6"/>
                                </div>
                                <h3 className="text-lg font-bold text-white">OpenAI 兼容协议</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px] leading-relaxed">
                                完美支持所有兼容 OpenAI 接口规范的服务商，从 DeepSeek 到 Moonshot，一键无缝接入。
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['DeepSeek', 'Moonshot', 'Yi', 'Qwen', 'SiliconFlow', 'OpenRouter'].map(bg => (
                                    <span key={bg} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                                        {bg}
                                    </span>
                                ))}
                                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 italic">+50 more</span>
                            </div>
                        </div>

                        {/* Card 2: Anthropic */}
                        <div className="p-8 rounded-2xl bg-[#0a0616] border border-white/5 hover:border-orange-500/30 hover:bg-[#0c081a] transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                    <Zap className="w-6 h-6"/>
                                </div>
                                <h3 className="text-lg font-bold text-white">Anthropic 原生支持</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px] leading-relaxed">
                                深度适配 Claude 系列模型，支持其特有的 Prompt Caching 与超长上下文视觉能力。
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku', 'Bedrock', 'Vertex AI'].map(bg => (
                                    <span key={bg} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                                        {bg}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Card 3: Local & Private */}
                        <div className="p-8 rounded-2xl bg-[#0a0616] border border-white/5 hover:border-blue-500/30 hover:bg-[#0c081a] transition-all group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                    <Cpu className="w-6 h-6"/>
                                </div>
                                <h3 className="text-lg font-bold text-white">本地与私有化</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px] leading-relaxed">
                                数据不出域。无缝对接本地推理引擎，构建极致安全、零延迟的内部编码环境。
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Ollama', 'LM Studio', 'LocalAI', 'vLLM', 'GPT4All'].map(bg => (
                                    <span key={bg} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                                        {bg}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Capabilities Grid */}
            <section className="py-16 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<Layers className="w-7 h-7 text-cyan-400"/>}
                            title="Unified API"
                            description="标准化的抽象层，让插件开发者无需关心底层模型差异。"
                        />
                        <FeatureCard
                            icon={<Lock className="w-7 h-7 text-fuchsia-400"/>}
                            title="Secure Vault"
                            description="API Key 加密存储于 IntelliJ Password Safe，杜绝泄露。"
                        />
                        <FeatureCard
                            icon={<Network className="w-7 h-7 text-violet-400"/>}
                            title="Stream Routing"
                            description="支持 SSE 流式传输与自动降级路由，确保服务高可用。"
                        />
                        <FeatureCard
                            icon={<Bot className="w-7 h-7 text-emerald-400"/>}
                            title="Context Mgmt"
                            description="智能上下文窗口管理，自动压缩 Prompt，最大化利用 Token。"
                        />
                    </div>
                </div>
            </section>

            {/* Developer CTA - Image Replacement */}
            <section className="py-12 border-t border-violet-900/20 bg-[#02010a]">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">极简的配置体验</h2>

                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-violet-500/20 group max-w-4xl mx-auto">
                        {/* Glassmorphism Overlay */}
                        <div className="absolute inset-0 bg-violet-600/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>

                        <img
                            src="/images/20260123233224_uxb93q4l.png"
                            alt="Engine Configuration Interface - Support 80+ Providers"
                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        />

                        {/* Caption */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 text-left z-20">
                            <div className="text-xs font-mono text-violet-300 bg-violet-900/50 px-2 py-1 rounded w-fit mb-2 border border-violet-500/30">
                                IntelliJ Settings &gt; Tools &gt; IntelliAI Engine
                            </div>
                            <p className="text-sm text-gray-300">
                                直观的配置面板，支持自定义 API Endpoint、模型参数及连接测试。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({icon, title, description}) => (
    <div className="p-6 rounded-2xl bg-[#0a0616] border border-violet-500/10 hover:border-violet-500/30 hover:bg-[#110b26] transition-all group">
        <div className="mb-4 p-2 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-violet-300/50 leading-relaxed">
            {description}
        </p>
    </div>
);
