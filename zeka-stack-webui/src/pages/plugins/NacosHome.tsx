import React, {useRef} from 'react';
import {ArrowDown, ChevronDown, Cloud, Download, FolderTree, Star} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const NacosHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

                <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold mb-8 animate-fade-in-up">
                        <Cloud className="w-4 h-4"/>
                        <span>{t('plugins.nacos.hero.badge')}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-8 leading-tight animate-fade-in-up delay-100">
                        {t('plugins.nacos.hero.title')}
                        <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            {t('plugins.nacos.hero.subtitle')}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed animate-fade-in-up delay-200">
                        {t('plugins.nacos.hero.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up delay-300">
                        <a href="https://plugins.jetbrains.com/plugin/29156" target="_blank" rel="noreferrer" className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-200/50 flex items-center gap-2 hover:-translate-y-1">
                            {t('plugins.nacos.hero.download_button')}
                            <Download className="w-5 h-5"/>
                        </a>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ArrowDown className="w-8 h-8 text-blue-600"/>
                </div>
            </section>


            {/* --- Section 2: Version Control --- */}
            <section className="h-full w-full snap-start bg-white flex items-center justify-center relative overflow-hidden border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                            {t('plugins.nacos.section2Title')} <br/>
                            <span className="text-blue-600">{t('plugins.nacos.section2Highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            {t('plugins.nacos.section2Desc')}
                        </p>

                        <div className="space-y-4">
                            {[
                                {ver: 'v3', msg: t('plugins.nacos.features.version_control.history.v3.msg'), time: '2m ago', active: true},
                                {ver: 'v2', msg: t('plugins.nacos.features.version_control.history.v2.msg'), time: '1h ago', active: false},
                            ].map((item) => (
                                <div key={item.ver} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${item.active ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-slate-100'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${item.active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {item.ver}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{item.msg}</div>
                                        <div className="text-xs text-slate-400">{item.time}</div>
                                    </div>
                                    {item.active && <div className="ml-auto text-[10px] font-bold text-blue-600 uppercase tracking-widest">Active</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Diff Viewer Mock */}
                    <div className="relative">
                        <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex justify-between">
                                <span>Comparison Viewer</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-slate-200 font-mono text-xs leading-6">
                                <div className="p-4 bg-red-50/30">
                                    <div className="text-red-400 mb-2 font-bold">- Remote</div>
                                    <div className="opacity-50">timeout: 3000</div>
                                    <div>retries: 3</div>
                                </div>
                                <div className="p-4 bg-emerald-50/30">
                                    <div className="text-emerald-600 mb-2 font-bold">+ Local Draft</div>
                                    <div className="bg-emerald-100 px-1 rounded">timeout: 5000</div>
                                    <div>retries: 3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-slate-900"/>
                </div>
            </section>


            {/* --- Section 3: Native Editor --- */}
            <section className="h-full w-full snap-start bg-slate-50 flex items-center justify-center relative overflow-hidden border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">

                    <div className="text-center max-w-3xl mb-12">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                            {t('plugins.nacos.section3Title')} <span className="text-indigo-600">{t('plugins.nacos.section3Highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-600">
                            {t('plugins.nacos.section3Desc')}
                        </p>
                    </div>

                    <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
                        {/* IDE Simulation Toolbar */}
                        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded border border-slate-200 text-xs font-mono text-slate-500">
                                <FolderTree className="w-3 h-3 text-amber-500"/>
                                namespaces/dev/gateway.yml
                            </div>
                        </div>
                        <div className="p-8 font-mono text-sm leading-relaxed text-slate-800">
                            <div className="flex gap-4">
                                <span className="text-slate-300">1</span>
                                <div><span className="text-purple-600">spring</span>:</div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-300">2</span>
                                <div className="pl-4"><span className="text-purple-600">cloud</span>:</div>
                            </div>
                            <div className="flex gap-4 bg-blue-50 -mx-8 px-8 border-l-4 border-blue-600">
                                <span className="text-slate-300">3</span>
                                <div className="pl-8"><span className="text-purple-600">nacos</span>: <span className="animate-pulse bg-blue-200 px-1">_</span></div>
                            </div>
                            <div className="pl-16 mt-2">
                                <div className="bg-white border border-slate-200 shadow-lg p-2 rounded text-xs space-y-1">
                                    <div className="bg-blue-600 text-white px-2 py-1 rounded flex justify-between"><span>discovery</span> <span className="opacity-50">Config</span></div>
                                    <div className="px-2 py-1">config</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-slate-900"/>
                </div>
            </section>


            {/* --- Section 4: CTA --- */}
            <section className="h-full w-full snap-start flex items-center justify-center bg-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-4xl text-center px-6 relative z-10 text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-10 border border-white/20">
                        <Star className="w-4 h-4 fill-current text-yellow-300"/>
                        <span>{t('plugins.nacos.cta.rating')} Rating</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">
                        Nacos Ops,<br/>
                        <span className="text-blue-200">Reimagined.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                        <a href="https://plugins.jetbrains.com/plugin/29156" target="_blank" rel="noreferrer" className="px-12 py-5 bg-white text-blue-700 font-bold text-xl rounded-xl transition-all shadow-2xl hover:bg-blue-50">
                            {t('plugins.nacos.cta.install_button')}
                        </a>
                        <a href="https://ideaplugin.dong4j.site/nacos/docs.html" target="_blank" rel="noreferrer" className="px-12 py-5 bg-blue-800/50 hover:bg-blue-800 text-white font-bold text-xl rounded-xl transition-all border border-blue-400/30 backdrop-blur-sm">
                            {t('plugins.nacos.cta.docs_button')}
                        </a>
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-12 text-blue-200/40 font-mono text-xs uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-2">Multi-Env Support</div>
                        <div className="flex items-center gap-2">History Rollback</div>
                        <div className="flex items-center gap-2">Instance Management</div>
                    </div>
                </div>
            </section>

        </div>
    );
};
