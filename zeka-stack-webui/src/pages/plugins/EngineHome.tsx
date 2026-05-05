import React, {useEffect, useRef, useState} from 'react';
import {Activity, ArrowDown, Bot, ChevronDown, Cpu, Database, Download, Globe, Layers, Lock, Network, Settings, Sparkles, Zap} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const EngineHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    // Animation state for data flow
    const [activePulse, setActivePulse] = useState(0);

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActivePulse((prev) => (prev + 1) % 4);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#030014] text-white font-sans selection:bg-violet-500/30 z-0">
            {/* Background Atmosphere - Global */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            </div>

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center z-10">
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/50 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-fade-in-up">
                        <Cpu className="w-4 h-4 text-violet-400"/>
                        <span>{t('plugins.engine.badge')}</span>
                    </div>

                    {/* Main Title - Clean, Bold and Professional */}
                    <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 animate-fade-in-up delay-100">
                        <span className="text-white">{t('plugins.engine.heroTitle')} </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            {t('plugins.engine.heroHighlight')}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-violet-200/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up delay-200">
                        {t('plugins.engine.heroDescription')}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
                        <a
                            href="https://plugins.jetbrains.com/plugin/29152"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-3.5 bg-amber-900/30 hover:bg-amber-900/60 border border-amber-500/20 text-amber-200 rounded-xl font-bold transition-all flex items-center gap-3 backdrop-blur-sm"
                        >
                            <Download className="w-5 h-5"/>
                            {t('home.installPlugin')}
                        </a>
                        <a href="https://ideaplugin.dong4j.site/engine/docs.html" target="_blank" rel="noreferrer" className="relative px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] flex items-center gap-3 group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient-x"></div>
                            <span className="relative flex items-center gap-2">
                                <Zap className="w-5 h-5 fill-current"/>
                                {t('plugins.engine.sdkButton')}
                            </span>
                        </a>
                        <button 
                            onClick={() => window.location.hash = '#/plugins/engine/monitor'}
                            className="px-8 py-3.5 bg-cyan-900/30 hover:bg-cyan-900/60 border border-cyan-500/20 text-cyan-200 rounded-xl font-bold transition-all flex items-center gap-3 backdrop-blur-sm group"
                        >
                            <Activity className="w-5 h-5 group-hover:animate-pulse"/>
                            {t('plugins.engine.monitorButton')}
                        </button>
                        <a
                            href="https://ideaplugin.dong4j.site/engine/docs.html"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-3.5 bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-500/20 text-emerald-200 rounded-xl font-bold transition-all flex items-center gap-3 backdrop-blur-sm"
                        >
                            <Globe className="w-5 h-5"/>
                            {t('common.viewDocs')}
                        </a>
                        <a
                            href="https://ideaplugin.dong4j.site/engine/docs.html"
                            target="_blank"
                            rel="noreferrer"
                            className="px-8 py-3.5 bg-[#1a103c]/30 hover:bg-[#1a103c]/60 border border-violet-500/20 text-violet-200 rounded-xl font-bold transition-all flex items-center gap-3 backdrop-blur-sm"
                        >
                            <Settings className="w-5 h-5"/>
                            {t('plugins.engine.configButton')}
                        </a>
                    </div>
                </div>

                {/* Animated Core Visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none -z-10 opacity-40">
                    <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-[60px] rounded-full border border-fuchsia-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 bg-violet-600/10 rounded-full blur-[80px] animate-pulse"></div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-20" onClick={scrollToNext}>
                    <ArrowDown className="w-6 h-6 text-violet-400 opacity-50 hover:opacity-100 transition-opacity"/>
                </div>
            </section>


            {/* --- Section 2: Architecture Matrix --- */}
            <section className="h-full w-full snap-start relative flex items-center justify-center bg-[#050511] z-10 overflow-hidden">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex flex-col h-full justify-center">
                    <div className="text-center mb-8 lg:mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {t('plugins.engine.matrixTitle')}
                        </h2>
                        <p className="text-violet-300/50 max-w-2xl mx-auto text-lg">
                            {t('plugins.engine.matrixDesc')}
                        </p>
                    </div>

                    {/* Diagram Container */}
                    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-items-center min-h-[400px]">
                        {/* Left: Consumers (Plugins) */}
                        <div className="flex flex-col justify-center space-y-4 relative z-10 w-full max-w-xs">
                            <div className="text-xs font-mono text-cyan-500/60 text-center mb-2 tracking-[0.2em] uppercase">{t('plugins.engine.consumersLabel')}</div>
                            {['Repairer', 'Tracer', 'Javadoc', 'Changelog'].map((plugin, idx) => (
                                <div key={plugin} className="group relative p-4 bg-[#0f0e24]/60 border border-violet-500/10 rounded-xl hover:border-cyan-400/40 transition-all cursor-default overflow-hidden backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center justify-between relative z-10 px-2">
                                        <span className="font-mono text-sm text-cyan-100/80">{plugin} Plugin</span>
                                        <Activity className={`w-4 h-4 text-cyan-500 ${idx === activePulse ? 'animate-ping' : ''}`}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Center: The Engine (Processing) */}
                        <div className="relative flex flex-col items-center justify-center z-20 my-8 lg:my-0 scale-110 lg:scale-125">
                            <div className="relative w-48 h-48 bg-[#0a051e] border border-violet-500/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.2)] backdrop-blur-xl group z-30">
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/20 animate-[spin_30s_linear_infinite]"></div>
                                <Cpu className="w-14 h-14 text-violet-400 mb-3 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"/>
                                <h3 className="text-sm font-bold text-white tracking-[0.2em]">{t('plugins.engine.engineLabel')}</h3>
                                <span className="text-[10px] text-violet-400 mt-1 font-mono bg-violet-900/20 px-2 py-0.5 rounded">{t('plugins.engine.activeStatus')}</span>
                            </div>

                            {/* Connecting Lines SVG */}
                            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none hidden lg:block overflow-visible z-0">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(6,182,212,0.05)"/>
                                        <stop offset="50%" stopColor="rgba(139,92,246,0.4)"/>
                                        <stop offset="100%" stopColor="rgba(236,72,153,0.05)"/>
                                    </linearGradient>
                                </defs>
                                {/* Left to Center */}
                                <path d="M150,80 C250,80 250,200 350,200" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="5,5"/>
                                <path d="M150,160 C250,160 250,200 350,200" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5"/>
                                <path d="M150,240 C250,240 250,200 350,200" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5"/>
                                <path d="M150,320 C250,320 250,200 350,200" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5" strokeDasharray="5,5"/>
                                
                                {/* Center to Right */}
                                <path d="M450,200 C550,200 550,100 650,100" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5"/>
                                <path d="M450,200 C550,200 550,200 650,200" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5"/>
                                <path d="M450,200 C550,200 550,300 650,300" fill="none" stroke="url(#lineGradient)" strokeWidth="1.5"/>
                            </svg>
                        </div>

                        {/* Right: Providers (LLMs) */}
                        <div className="flex flex-col justify-center space-y-4 relative z-10 w-full max-w-xs">
                            <div className="text-xs font-mono text-fuchsia-500/60 text-center mb-2 tracking-[0.2em] uppercase">{t('plugins.engine.providersLabel')}</div>
                            {[
                                {name: 'OpenAI GPT-4', icon: Globe, color: 'text-green-500'},
                                {name: 'Aliyun Qwen', icon: Database, color: 'text-orange-500'},
                                {name: 'Local Ollama', icon: Bot, color: 'text-blue-500'},
                            ].map((provider) => (
                                <div key={provider.name} className="group relative p-4 bg-[#0f0e24]/60 border border-violet-500/10 rounded-xl hover:border-fuchsia-400/40 transition-all cursor-default backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-3 relative z-10 px-2">
                                        <provider.icon className={`w-5 h-5 ${provider.color} opacity-80`}/>
                                        <span className="font-mono text-sm text-fuchsia-100/80">{provider.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer z-30" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-violet-500 opacity-30 hover:opacity-100"/>
                </div>
            </section>


            {/* --- Section 3: Ecosystem Providers --- */}
            <section className="h-full w-full snap-start relative flex items-center justify-center bg-[#04010e] z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl w-full mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/20 border border-violet-500/20 text-violet-300 text-xs font-bold mb-6">
                            <Sparkles className="w-3 h-3 text-yellow-400"/>
                            <span>{t('plugins.engine.freedomBadge')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {t('plugins.engine.providersTitle')}
                        </h2>
                        <p className="text-violet-200/50 max-w-2xl mx-auto leading-relaxed text-lg">
                            {t('plugins.engine.providersDesc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: OpenAI Compatible */}
                        <div className="p-8 rounded-2xl bg-[#0a0616] border border-white/5 hover:border-emerald-500/30 hover:bg-[#0c081a] transition-all group hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                                    <Globe className="w-6 h-6"/>
                                </div>
                                <h3 className="text-xl font-bold text-white">{t('plugins.engine.openaiCardTitle')}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px] leading-relaxed">
                                {t('plugins.engine.openaiCardDesc')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['DeepSeek', 'Moonshot', 'Yi', 'Qwen', 'SiliconFlow', 'OpenRouter'].map(bg => (
                                    <span key={bg} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                                        {bg}
                                    </span>
                                ))}
                                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 italic">{t('plugins.engine.openaiCardMore')}</span>
                            </div>
                        </div>

                        {/* Card 2: Anthropic */}
                        <div className="p-8 rounded-2xl bg-[#0a0616] border border-white/5 hover:border-orange-500/30 hover:bg-[#0c081a] transition-all group hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                    <Zap className="w-6 h-6"/>
                                </div>
                                <h3 className="text-xl font-bold text-white">{t('plugins.engine.anthropicCardTitle')}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px] leading-relaxed">
                                {t('plugins.engine.anthropicCardDesc')}
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
                        <div className="p-8 rounded-2xl bg-[#0a0616] border border-white/5 hover:border-blue-500/30 hover:bg-[#0c081a] transition-all group hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                    <Cpu className="w-6 h-6"/>
                                </div>
                                <h3 className="text-xl font-bold text-white">{t('plugins.engine.localCardTitle')}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 min-h-[40px] leading-relaxed">
                                {t('plugins.engine.localCardDesc')}
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

                <div className="absolute bottom-8 animate-bounce cursor-pointer z-30" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-violet-500 opacity-30 hover:opacity-100"/>
                </div>
            </section>


            {/* --- Section 4: Capabilities & CTA --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center bg-[#02010a] z-10">
                <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex flex-col justify-center h-full py-20">
                    
                    {/* Capabilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        <FeatureCard
                            icon={<Layers className="w-7 h-7 text-cyan-400"/>}
                            title={t('plugins.engine.unifiedApiTitle')}
                            description={t('plugins.engine.unifiedApiDesc')}
                        />
                        <FeatureCard
                            icon={<Lock className="w-7 h-7 text-fuchsia-400"/>}
                            title={t('plugins.engine.secureVaultTitle')}
                            description={t('plugins.engine.secureVaultDesc')}
                        />
                        <FeatureCard
                            icon={<Network className="w-7 h-7 text-violet-400"/>}
                            title={t('plugins.engine.streamRoutingTitle')}
                            description={t('plugins.engine.streamRoutingDesc')}
                        />
                        <FeatureCard
                            icon={<Bot className="w-7 h-7 text-emerald-400"/>}
                            title={t('plugins.engine.contextMgmtTitle')}
                            description={t('plugins.engine.contextMgmtDesc')}
                        />
                    </div>

                    {/* Developer CTA */}
                    <div className="text-center max-w-5xl mx-auto w-full">
                        <h2 className="text-3xl font-bold text-white mb-8">{t('plugins.engine.simpleConfigTitle')}</h2>

                        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-violet-500/20 group max-w-4xl mx-auto">
                            {/* Glassmorphism Overlay */}
                            <div className="absolute inset-0 bg-violet-600/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>

                            <img
                                src="/images/20260123233224_uxb93q4l.png"
                                alt="Engine Configuration Interface - Support 80+ Providers"
                                className="w-full h-auto max-h-[40vh] object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Caption */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 text-left z-20">
                                <div className="text-xs font-mono text-violet-300 bg-violet-900/50 px-2 py-1 rounded w-fit mb-2 border border-violet-500/30">
                                    {t('plugins.engine.configPath')}
                                </div>
                                <p className="text-sm text-gray-300">
                                    {t('plugins.engine.configDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({icon, title, description}) => (
    <div className="p-6 rounded-2xl bg-[#0a0616] border border-violet-500/10 hover:border-violet-500/30 hover:bg-[#110b26] transition-all group hover:-translate-y-1">
        <div className="mb-4 p-2 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-violet-300/50 leading-relaxed">
            {description}
        </p>
    </div>
);