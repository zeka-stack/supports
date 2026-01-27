import React, {useEffect, useRef, useState} from 'react';
import {AlertCircle, ArrowDown, CheckCircle2, ChevronDown, Hammer, RefreshCw, ShieldCheck, Sparkles, Zap} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const RepairerHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [codeState, setCodeState] = useState<'error' | 'fixing' | 'fixed'>('error');

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCodeState(current => {
                if (current === 'error') return 'fixing';
                if (current === 'fixing') return 'fixed';
                return 'error';
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#0c0a09] text-stone-300 font-sans selection:bg-emerald-500/30 z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16 relative z-10">

                    {/* Left: Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider animate-fade-in-up">
                            <Hammer className="w-4 h-4"/>
                            <span>{t('plugins.repairer.hero.badge')}</span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight animate-fade-in-up delay-100">
                            {t('plugins.repairer.hero.title')}
                            <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                {t('plugins.repairer.hero.subtitle')}
                            </span>
                        </h1>

                        <p className="text-xl text-stone-400 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
                            {t('plugins.repairer.hero.description')}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 animate-fade-in-up delay-300">
                            <button className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                {t('plugins.repairer.hero.fix_button')}
                                <Sparkles className="w-5 h-5 text-yellow-300"/>
                            </button>
                        </div>
                    </div>

                    {/* Right: Visual Demo */}
                    <div className="w-full lg:w-1/2 animate-fade-in-up delay-500">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-rose-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-70"></div>
                            <div className="relative bg-[#141210] rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-[#1c1917] border-b border-stone-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                    </div>
                                    <div className="text-xs font-mono text-stone-500 tracking-widest">AUTO_REPAIRER.JAVA</div>
                                </div>

                                <div className="p-8 font-mono text-sm min-h-[320px] flex flex-col justify-center">
                                    {codeState === 'error' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-start gap-3 p-3 rounded bg-rose-950/20 border border-rose-900/30 mb-6">
                                                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"/>
                                                <div className="text-xs text-rose-400 font-bold">Line length 120 &gt; 80 (Checkstyle)</div>
                                            </div>
                                            <div className="text-stone-500 opacity-50">public void logUser(User u) {'{'}</div>
                                            <div className="pl-4 py-1 bg-rose-500/10 border-l-2 border-rose-500 text-stone-200">
                                                System.out.println("User " + u.getName() + " login at " + new Date() + " with status...");
                                            </div>
                                            <div className="text-stone-500 opacity-50">{'}'}</div>
                                        </div>
                                    )}

                                    {codeState === 'fixing' && (
                                        <div className="flex flex-col items-center py-10 animate-in zoom-in duration-300">
                                            <div className="relative">
                                                <RefreshCw className="w-16 h-16 text-emerald-500 animate-spin"/>
                                                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce"/>
                                            </div>
                                            <div className="mt-6 text-emerald-400 font-bold tracking-[0.2em] text-xs">AI SURGICAL CORRECTION</div>
                                        </div>
                                    )}

                                    {codeState === 'fixed' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-center gap-2 text-emerald-400 mb-6 bg-emerald-950/30 px-3 py-2 rounded border border-emerald-900/50 w-fit">
                                                <CheckCircle2 className="w-4 h-4"/>
                                                <span className="text-xs font-bold uppercase tracking-wider">Restored Successfully</span>
                                            </div>
                                            <div className="text-stone-500 opacity-50">public void logUser(User u) {'{'}</div>
                                            <div className="pl-4 text-emerald-100 space-y-1">
                                                <span className="text-purple-400">String</span> msg = <span className="text-purple-400">String</span>.format(<br/>
                                                &nbsp;&nbsp;<span className="text-yellow-200">"User %s login at %s..."</span>,<br/>
                                                &nbsp;&nbsp;u.getName(), <span className="text-purple-400">new</span> Date()<br/>
                                                );
                                            </div>
                                            <div className="text-stone-500 opacity-50 mt-1">{'}'}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ArrowDown className="w-8 h-8 text-emerald-500"/>
                </div>
            </section>


            {/* --- Section 2: Surgical Precision --- */}
            <section className="h-full w-full snap-start bg-[#141210] flex items-center justify-center relative overflow-hidden border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Left: Visual representation of rules */}
                    <div className="order-2 md:order-1 relative flex justify-center">
                        <div className="grid grid-cols-2 gap-4">
                            {[t('plugins.repairer.hero.supported_tools.checkstyle'), 'PMD', 'FindBugs', 'Sonar'].map((rule, i) => (
                                <div key={i} className="p-6 bg-[#1c1917] rounded-xl border border-stone-800 flex flex-col items-center gap-4 group hover:border-emerald-500/50 transition-all">
                                    <ShieldCheck className={`w-10 h-10 ${i % 2 === 0 ? 'text-emerald-500' : 'text-blue-500'}`}/>
                                    <span className="font-bold text-sm tracking-widest uppercase">{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            {t('plugins.repairer.section2Title')} <br/>
                            <span className="text-emerald-500">{t('plugins.repairer.section2Highlight')}</span>
                        </h2>
                        <p className="text-xl text-stone-400 leading-relaxed">
                            {t('plugins.repairer.section2Desc')}
                        </p>
                        <div className="space-y-4">
                            {[
                                t('plugins.repairer.features.quickfix.title'),
                                t('plugins.repairer.features.configurable_rules.title')
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-lg font-medium">{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-white"/>
                </div>
            </section>


            {/* --- Section 3: Team Standards --- */}
            <section className="h-full w-full snap-start bg-[#0c0a09] flex flex-col items-center justify-center relative border-t border-stone-800">
                <div className="text-center max-w-4xl px-6 mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20">
                        <Zap className="w-10 h-10 text-blue-400"/>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        {t('plugins.repairer.section3Title')} <span className="text-blue-400">{t('plugins.repairer.section3Highlight')}</span>
                    </h2>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                        {t('plugins.repairer.section3Desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6 w-full">
                    {[
                        {title: 'Custom XML Config', icon: RefreshCw},
                        {title: 'Auto-Sync Rules', icon: ShieldCheck},
                        {title: 'CI/CD Ready', icon: Zap},
                    ].map((item, i) => (
                        <div key={i} className="p-8 bg-[#141210] rounded-2xl border border-stone-800 hover:border-blue-500/30 transition-all hover:-translate-y-2">
                            <item.icon className="w-8 h-8 text-blue-400 mb-6"/>
                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                            <div className="h-1 w-full bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-white"/>
                </div>
            </section>


            {/* --- Section 4: CTA --- */}
            <section className="h-full w-full snap-start bg-[#050505] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/5"></div>
                <div className="max-w-4xl text-center px-6 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                        Restoring Code<br/>
                        <span className="text-emerald-500">Integrity.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-stone-400 mb-12 max-w-2xl mx-auto font-light">
                        {t('plugins.repairer.cta.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xl transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                            {t('plugins.repairer.cta.button')}
                        </button>
                    </div>

                    <div className="mt-20 flex justify-center gap-12 text-stone-600 font-mono text-xs uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 100% Accurate</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Enterprise Ready</div>
                    </div>
                </div>
            </section>

        </div>
    );
};
