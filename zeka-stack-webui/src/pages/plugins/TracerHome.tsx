import React, {useRef} from 'react';
import {Activity, ArrowDown, ChevronDown, Cpu, Eye, FileText, GitBranch, Layout, Search, Zap} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const TracerHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 animate-pulse">
                        <Activity className="w-4 h-4"/>
                        <span>{t('plugins.tracer.hero.badge')}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 animate-fade-in-up">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                            IntelliAI Tracer
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up delay-100">
                        {t('plugins.tracer.hero.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-200">
                        <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 group">
                            {t('plugins.tracer.hero.install_button')}
                            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                        </button>
                        <button className="px-10 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold transition-all flex items-center gap-2">
                            <FileText className="w-5 h-5"/>
                            {t('plugins.tracer.hero.docs_button')}
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ArrowDown className="w-8 h-8 text-blue-400"/>
                </div>
            </section>


            {/* --- Section 2: Visual Intelligence --- */}
            <section className="h-full w-full snap-start bg-[#030816] flex items-center justify-center relative overflow-hidden border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-white">
                            {t('plugins.tracer.section2Title')} <span className="text-cyan-400">{t('plugins.tracer.section2Highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            {t('plugins.tracer.section2Desc')}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-colors group">
                                <GitBranch className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform"/>
                                <h3 className="text-lg font-bold text-slate-100 mb-2">{t('plugins.tracer.diagnostic.call_chain.title')}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{t('plugins.tracer.diagnostic.call_chain.desc')}</p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors group">
                                <Layout className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform"/>
                                <h3 className="text-lg font-bold text-slate-100 mb-2">{t('plugins.tracer.diagnostic.class_modeling.title')}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{t('plugins.tracer.diagnostic.class_modeling.desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Code Flow Visual */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative bg-[#0f172a] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#1e293b] border-b border-slate-700">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                                </div>
                                <span className="text-xs text-slate-400 font-mono italic ml-4">CallGraph_Inspector.v1</span>
                            </div>
                            <div className="p-8 font-mono text-sm space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                    <div>
                                        <span className="text-blue-400">UserService</span>.createUser()
                                        <div className="pl-6 mt-4 border-l border-slate-700 space-y-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <div className="w-4 h-px bg-slate-700"></div> validateInput()
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-300 bg-cyan-500/10 p-1 rounded">
                                                <div className="w-4 h-px bg-cyan-500"></div>
                                                <span className="text-cyan-400 font-bold">UserMapper</span>.insertUser()
                                                <span className="text-[10px] bg-cyan-500/20 px-1 rounded ml-auto tracking-widest animate-pulse">EXECUTING</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <div className="w-4 h-px bg-slate-700"></div> <span className="text-indigo-400">AuditLogger</span>.log()
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700/50 text-slate-400 italic shadow-inner">
                                    <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                                        <Eye className="w-4 h-4"/> [AI Insights]
                                    </div>
                                    该流程采用 Service 模式封装，包含了参数验证、持久化及异步审计记录。建议对 log 调用进行异常隔离以防止阻塞主流程。
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-white"/>
                </div>
            </section>


            {/* --- Section 3: Performance Hotspots --- */}
            <section className="h-full w-full snap-start bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-center max-w-4xl px-6 mb-16">
                     <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-full mb-6 border border-orange-500/20">
                        <Zap className="w-10 h-10 text-orange-400"/>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        {t('plugins.tracer.section3Title')} <span className="text-orange-500">{t('plugins.tracer.section3Highlight')}</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        {t('plugins.tracer.section3Desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6 w-full">
                    {[
                        {icon: Activity, title: t('plugins.tracer.performanceFeature1'), color: 'text-rose-400'},
                        {icon: Search, title: t('plugins.tracer.performanceFeature2'), color: 'text-orange-400'},
                        {icon: Zap, title: t('plugins.tracer.performanceFeature3'), color: 'text-amber-400'},
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-orange-500/30 transition-all group hover:-translate-y-2">
                             <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                                <feature.icon className="w-6 h-6"/>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r from-orange-600 to-amber-400 animate-progress`} style={{width: `${70 + i * 10}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-white"/>
                </div>
            </section>


            {/* --- Section 4: Engine Powered & CTA --- */}
            <section className="h-full w-full snap-start bg-[#01030d] flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>

                 <div className="max-w-4xl text-center px-6 relative z-10">
                    <Cpu className="w-16 h-16 text-blue-500 mx-auto mb-10 animate-pulse"/>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                        {t('plugins.tracer.ctaTitle')}
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        {t('plugins.tracer.ctaDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xl transition-all shadow-2xl hover:shadow-blue-500/40">
                            {t('plugins.tracer.hero.install_button')}
                        </button>
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-800/50">
                        <div className="text-slate-500 uppercase text-xs tracking-[0.3em] mb-8">{t('plugins.tracer.engine.title')}</div>
                        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                             <span className="font-bold text-xl text-slate-300">OpenAI</span>
                             <span className="font-bold text-xl text-slate-300">Ollama</span>
                             <span className="font-bold text-xl text-slate-300">Anthropic</span>
                             <span className="font-bold text-xl text-slate-300">DeepSeek</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
