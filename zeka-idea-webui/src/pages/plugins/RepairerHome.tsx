import React, {useEffect, useState} from 'react';
import {AlertCircle, Check, CheckCircle2, Hammer, Play, RefreshCw, Settings, Sparkles, Zap} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const RepairerHome: React.FC = () => {
    const {t} = useTranslation();
    const [codeState, setCodeState] = useState<'error' | 'fixing' | 'fixed'>('error');

    useEffect(() => {
        const interval = setInterval(() => {
            setCodeState(current => {
                if (current === 'error') return 'fixing';
                if (current === 'fixing') return 'fixed';
                return 'error'; // Cycle back
            });
        }, 3500); // Slightly faster cycle

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans selection:bg-emerald-500/30">
            {/* Hero Section - Split Layout */}
            <section className="relative pt-20 pb-20 lg:pt-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Column: Content */}
                        <div className="text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <Hammer className="w-3 h-3"/>
                                <span>{t('plugins.repairer.hero.badge')}</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1]">
                                {t('plugins.repairer.hero.title')}
                                <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                                    {t('plugins.repairer.hero.subtitle')}
                                </span>
                            </h1>

                            <p className="text-lg text-stone-400 leading-relaxed max-w-xl">
                                {t('plugins.repairer.hero.description')}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 group">
                                    {t('plugins.repairer.hero.fix_button')}
                                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                                </button>
                                <button className="px-8 py-3.5 bg-[#1c1917] hover:bg-[#292524] border border-stone-800 text-stone-200 rounded-lg font-medium transition-all flex items-center gap-2">
                                    <Play className="w-4 h-4"/>
                                    {t('plugins.repairer.hero.demo_button')}
                                </button>
                            </div>

                            <div className="pt-8 border-t border-stone-800/50 flex items-center gap-6 text-sm text-stone-500 font-mono">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    {t('plugins.repairer.hero.supported_tools.checkstyle')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
                                    {t('plugins.repairer.hero.supported_tools.pmd')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                                    {t('plugins.repairer.hero.supported_tools.alibaba_guide')}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual Demo (Moved from below) */}
                        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-rose-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-70"></div>
                            <div className="relative bg-[#141210] rounded-xl border border-stone-800 shadow-2xl overflow-hidden">
                                {/* Editor Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-[#1c1917] border-b border-stone-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                    </div>
                                    <div className="text-xs font-mono text-stone-500">Violations.java</div>
                                </div>

                                {/* Editor Content */}
                                <div className="p-6 font-mono text-sm min-h-[280px] flex flex-col justify-center">
                                    {codeState === 'error' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-start gap-3 p-3 rounded bg-rose-950/20 border border-rose-900/30 mb-4">
                                                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"/>
                                                <div>
                                                    <div className="text-rose-400 font-bold text-xs mb-1">CHECKSTYLE ERROR</div>
                                                    <div className="text-stone-400 text-xs">Line length is 120 chars (max 80).</div>
                                                </div>
                                            </div>
                                            <div className="text-stone-300 opacity-50">
                                                public void logUserAction(User user) {'{'}
                                            </div>
                                            <div className="pl-4 py-1 bg-rose-500/10 border-l-2 border-rose-500 text-stone-200 mt-1">
                                                System.out.println("User " + user.getName() + " performed action at " + new Date() + " with
                                                ID...");
                                            </div>
                                            <div className="text-stone-300 opacity-50 mt-1">{'}'}</div>
                                        </div>
                                    )}

                                    {codeState === 'fixing' && (
                                        <div className="flex flex-col items-center py-8 animate-in zoom-in duration-300">
                                            <div className="relative">
                                                <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin"/>
                                                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce"/>
                                            </div>
                                            <div className="mt-4 text-emerald-400 font-bold tracking-wide">AI OPTIMIZING</div>
                                            <div className="text-xs text-stone-500 mt-2">Refactoring string concatenation...</div>
                                        </div>
                                    )}

                                    {codeState === 'fixed' && (
                                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-center gap-2 text-emerald-400 mb-4 bg-emerald-950/30 px-3 py-2 rounded border border-emerald-900/50 w-fit">
                                                <CheckCircle2 className="w-4 h-4"/>
                                                <span className="text-xs font-bold">Fixed Automatically</span>
                                            </div>
                                            <div className="text-stone-300 opacity-50">
                                                public void logUserAction(User user) {'{'}
                                            </div>
                                            <div className="pl-4 mt-1 text-emerald-100">
                                                <span className="text-purple-400">String</span> logMsg
                                                = <span className="text-purple-400">String</span>.format(<br/>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <span className="text-yellow-200">"User %s performed action..."</span>,<br/>
                                                &nbsp;&nbsp;&nbsp;&nbsp;user.getName()<br/>
                                                );
                                            </div>
                                            <div className="text-stone-300 opacity-50 mt-1">{'}'}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Dark Cards */}
            <section className="py-24 bg-[#141210] border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">{t('plugins.repairer.features.title')}</h2>
                        <p className="text-stone-400">
                            {t('plugins.repairer.features.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-400"/>}
                            title={t('plugins.repairer.features.quickfix.title')}
                            description={t('plugins.repairer.features.quickfix.desc')}
                        />
                        <FeatureCard
                            icon={<Settings className="w-6 h-6 text-emerald-400"/>}
                            title={t('plugins.repairer.features.configurable_rules.title')}
                            description={t('plugins.repairer.features.configurable_rules.desc')}
                        />
                        <FeatureCard
                            icon={<Check className="w-6 h-6 text-blue-400"/>}
                            title={t('plugins.repairer.features.batch_processing.title')}
                            description={t('plugins.repairer.features.batch_processing.desc')}
                        />
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/10"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('plugins.repairer.cta.title')}</h2>
                    <p className="text-stone-400 mb-8 text-lg">
                        {t('plugins.repairer.cta.description')}
                    </p>
                    <button className="px-10 py-4 bg-white text-stone-900 rounded-full font-bold hover:bg-stone-200 transition-colors shadow-xl">
                        {t('plugins.repairer.cta.button')}
                    </button>
                </div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({icon, title, description}) => (
    <div className="group p-8 rounded-2xl bg-[#1c1917] border border-stone-800 hover:border-emerald-500/30 hover:bg-[#201d1b] transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-[#292524] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{title}</h3>
        <p className="text-stone-400 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);
