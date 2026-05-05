import React, {useRef} from 'react';
import {
    ArrowDown,
    BookOpen,
    BrainCircuit,
    Check,
    ChevronDown,
    FileCode,
    Globe2,
    Settings,
    ShieldCheck,
    Sparkles,
    Terminal
} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const JavadocHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#FFFBF0] text-gray-800 font-sans selection:bg-orange-200 z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col justify-center items-center bg-[#FFFBF0] overflow-hidden">
                 {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-100/50 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="max-w-6xl w-full px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">

                    {/* Left: Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                            <BookOpen className="w-4 h-4"/>
                            {t('plugins.javadoc.badge')}
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight animate-fade-in-up delay-100">
                            {t('plugins.javadoc.heroTitle')}
                            <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                                {t('plugins.javadoc.heroHighlight')}
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light animate-fade-in-up delay-200 max-w-lg mx-auto md:mx-0">
                            {t('plugins.javadoc.heroDescription')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5 animate-fade-in-up delay-300">
                             <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400"/>
                                {t('plugins.javadoc.generateButton')}
                            </button>
                            <a href="https://ideaplugin.dong4j.site/javadoc/docs.html" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                                <FileCode className="w-5 h-5 text-gray-500"/>
                                {t('plugins.javadoc.viewDocsButton')}
                            </a>
                        </div>
                    </div>

                    {/* Right: Visual Demo */}
                    <div className="w-full md:w-1/2 relative animate-fade-in-up delay-500">
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <div className="bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm text-gray-300 shadow-inner overflow-hidden">
                                <div className="flex gap-2 mb-4 border-b border-gray-700 pb-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>

                                {/* Generated Doc */}
                                <div className="animate-pulse-subtle">
                                    <span className="text-gray-500">/**</span><br/>
                                    <span className="text-gray-500">&nbsp;* Calculates the final price with tax applied.</span><br/>
                                    <span className="text-gray-500">&nbsp;*</span><br/>
                                    <span className="text-gray-500">&nbsp;* @param items List of cart items to process</span><br/>
                                    <span className="text-gray-500">&nbsp;* @param region Tax region code (e.g., "US-CA")</span><br/>
                                    <span className="text-gray-500">&nbsp;* @return Total price as BigDecimal</span><br/>
                                    <span className="text-gray-500">&nbsp;* @throws IllegalArgumentException if items list is empty</span><br/>
                                    <span className="text-gray-500">&nbsp;*/</span>
                                </div>
                                <div className="mt-2 opacity-50">
                                    <span className="text-purple-400">public</span> <span className="text-yellow-400">BigDecimal</span> <span className="text-blue-400">calculateTotal</span>(...) {'{'}
                                </div>
                            </div>
                        </div>
                         {/* Floating Badge */}
                         <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-orange-100 flex items-center gap-3 animate-bounce hidden md:flex">
                             <div className="bg-green-100 p-2 rounded-full">
                                <Check className="w-5 h-5 text-green-600"/>
                             </div>
                             <div className="text-sm font-bold text-gray-700">
                                 Standard Format<br/>
                                 <span className="text-xs text-gray-500 font-normal">JavaDoc + Checkstyle</span>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ArrowDown className="w-8 h-8 text-orange-900"/>
                </div>
            </section>


            {/* --- Section 2: Deep Analysis --- */}
            <section className="h-full w-full snap-start bg-white flex items-center justify-center relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Visual: Brain/Process */}
                    <div className="order-2 md:order-1 relative flex justify-center">
                        <div className="relative w-[400px] h-[400px]">
                            {/* Central Brain */}
                            <div className="absolute inset-0 bg-orange-50 rounded-full animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-full shadow-xl border border-orange-100 z-10">
                                <BrainCircuit className="w-20 h-20 text-orange-500"/>
                            </div>

                            {/* Orbiting Elements */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 text-xs font-mono w-48 animate-float">
                                <span className="font-bold text-gray-800">Input:</span><br/>
                                if (x == null) throw...
                            </div>
                            <div className="absolute bottom-10 right-0 bg-white p-4 rounded-lg shadow-lg border-l-4 border-green-500 text-xs font-mono w-48 animate-float delay-700">
                                <span className="font-bold text-gray-800">Output:</span><br/>
                                @throws NullPointerException
                            </div>
                            <div className="absolute bottom-10 left-0 bg-white p-4 rounded-lg shadow-lg border-l-4 border-purple-500 text-xs font-mono w-48 animate-float delay-1000">
                                <span className="font-bold text-gray-800">Context:</span><br/>
                                User Service Logic
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
                            {t('plugins.javadoc.section2Title')} <br/>
                            <span className="text-orange-500">{t('plugins.javadoc.section2Highlight')}</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                             {t('plugins.javadoc.section2Desc')}
                        </p>

                        <div className="space-y-6">
                            {[
                                t('plugins.javadoc.feature2_1'),
                                t('plugins.javadoc.feature2_2'),
                                t('plugins.javadoc.feature2_3')
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                        <Check className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors"/>
                                    </div>
                                    <span className="text-lg font-medium text-gray-800">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-gray-900"/>
                </div>
            </section>


            {/* --- Section 3: Standards & Localization --- */}
            <section className="h-full w-full snap-start bg-[#FFFBF0] flex flex-col items-center justify-center relative">
                <div className="text-center max-w-4xl px-6 mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6 text-blue-600">
                        <Globe2 className="w-8 h-8"/>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">{t('plugins.javadoc.section3Title')}</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t('plugins.javadoc.section3Desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6 w-full">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 border-blue-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('plugins.javadoc.card1Title')}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                             {t('plugins.javadoc.card1Desc')}
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
                            <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">EN</span>
                                <span className="text-gray-500">Calculate user age</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">CN</span>
                                <span className="text-gray-500">计算用户年龄</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 border-green-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('plugins.javadoc.card2Title')}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {t('plugins.javadoc.card2Desc')}
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500"/> Google Style Guide
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500"/> Alibaba Java Guide
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500"/> Custom Checkstyle
                            </div>
                        </div>
                    </div>

                     {/* Card 3 */}
                     <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-t-4 border-purple-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('plugins.javadoc.card3Title')}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {t('plugins.javadoc.card3Desc')}
                        </p>
                        <div className="font-mono text-xs bg-gray-900 text-gray-300 p-4 rounded-lg">
                            {'/**'}<br/>
                            {' * @author ${USER}'}<br/>
                            {' * @since ${DATE}'}<br/>
                            {' */'}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-gray-900"/>
                </div>
            </section>


            {/* --- Section 4: Privacy & CTA --- */}
            <section className="h-full w-full snap-start bg-[#1a1a1a] text-white flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">

                    {/* Left: Privacy Focus */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-900/50 border border-green-500/30 text-green-400 text-xs font-bold mb-6">
                            <ShieldCheck className="w-4 h-4"/>
                            {t('plugins.javadoc.privacyBadge')}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                             {t('plugins.javadoc.privacyTitle')}
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                             {t('plugins.javadoc.privacyDesc')}
                        </p>

                        <div className="flex gap-6">
                             <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <Terminal className="w-8 h-8 text-orange-400"/>
                                <span className="text-sm font-mono text-gray-300">Ollama</span>
                             </div>
                             <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <Settings className="w-8 h-8 text-blue-400"/>
                                <span className="text-sm font-mono text-gray-300">LocalAI</span>
                             </div>
                        </div>
                    </div>

                    {/* Right: Installation */}
                    <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 text-center">
                        <h3 className="text-3xl font-bold mb-4">Start Documenting Now</h3>
                        <p className="text-gray-400 mb-8">Install the Zeka Javadoc plugin and never write manual @param tags again.</p>

                        <a href="https://plugins.jetbrains.com/plugin/28835" target="_blank" rel="noreferrer" className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/30 mb-4 flex items-center justify-center">
                            Install from JetBrains Marketplace
                        </a>
                        <p className="text-xs text-gray-500">Requires IntelliJ IDEA 2023.1+</p>
                    </div>

                </div>
            </section>

        </div>
    );
};
