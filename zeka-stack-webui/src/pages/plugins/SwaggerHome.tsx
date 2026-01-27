import React, {useRef, useState} from 'react';
import {ArrowDown, ChevronDown, Code2, FileJson, Globe, Layout, Play, RefreshCw, Server, Settings, ShieldCheck, Zap} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const SwaggerHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    const handleSend = () => {
        setRequestStatus('loading');
        setTimeout(() => {
            setRequestStatus('success');
        }, 1500);
    };

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#0c0c0e] text-slate-300 font-sans selection:bg-amber-500/30 z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                        <Globe className="w-4 h-4"/>
                        <span>{t('plugins.swagger.badge')}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8 text-center animate-fade-in-up delay-100">
                        {t('plugins.swagger.heroTitle1')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            {t('plugins.swagger.heroHighlight')}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl text-center mb-12 animate-fade-in-up delay-200">
                        {t('plugins.swagger.heroDescription')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up delay-300">
                        <button className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2">
                            {t('plugins.swagger.installButton')}
                            <Zap className="w-5 h-5"/>
                        </button>
                        <button className="px-10 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                            <FileJson className="w-5 h-5 text-amber-500"/>
                            {t('plugins.swagger.exportJsonButton')}
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ArrowDown className="w-8 h-8 text-amber-500"/>
                </div>
            </section>


            {/* --- Section 2: Annotation Free --- */}
            <section className="h-full w-full snap-start bg-[#131316] flex items-center justify-center relative overflow-hidden border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Left: Code Snippet */}
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-3xl"></div>
                        <div className="relative bg-[#1a1a1e] border border-slate-800 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center gap-2 mb-6 text-slate-500 border-b border-slate-800 pb-4">
                                <Code2 className="w-5 h-5"/>
                                <span className="text-xs font-mono tracking-widest uppercase">Pure_Controller.java</span>
                            </div>
                            <pre className="font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
                                <span className="text-purple-400">@RestController</span><br/>
                                <span className="text-amber-500">public class</span> <span className="text-blue-400">UserController</span> {'{'}<br/><br/>
                                &nbsp;&nbsp;
                                <span className="text-slate-500">/**<br/>&nbsp;&nbsp; * Fetch user by ID<br/>&nbsp;&nbsp; */</span><br/>
                                &nbsp;&nbsp;
                                <span className="text-purple-400">@GetMapping</span>(<span className="text-emerald-400">"/users/{'{'}id{'}'}"</span>)<br/>
                                &nbsp;&nbsp;<span className="text-amber-500">public</span> <span className="text-blue-400">User</span> get(<span className="text-purple-400">@PathVariable</span> Long id) {'{'}...{'}'}<br/>
                                {'}'}
                            </pre>
                            <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <ShieldCheck className="w-6 h-6 text-emerald-500"/>
                                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">NO @OPERATION NEEDED</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            {t('plugins.swagger.section2Title')} <br/>
                            <span className="text-amber-500">{t('plugins.swagger.section2Highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            {t('plugins.swagger.section2Desc')}
                        </p>
                        <ul className="space-y-4">
                            {[
                                t('plugins.swagger.feature1Title'),
                                t('plugins.swagger.feature3Title')
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-200">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    <span className="text-lg font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-white"/>
                </div>
            </section>


            {/* --- Section 3: Integrated Debugger --- */}
            <section className="h-full w-full snap-start bg-[#0c0c0e] flex items-center justify-center relative overflow-hidden border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">

                    <div className="text-center max-w-3xl mb-12">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            {t('plugins.swagger.section3Title')} <span className="text-orange-500">{t('plugins.swagger.section3Highlight')}</span>
                        </h2>
                        <p className="text-xl text-slate-400">
                            {t('plugins.swagger.section3Desc')}
                        </p>
                    </div>

                    {/* Visual: IDE Mockup with Tabs */}
                    <div className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#131316] shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1e] border-b border-slate-800">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono"><Server className="w-3 h-3"/> DEV_ENV</div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono"><Settings className="w-3 h-3"/> CONFIG.JSON</div>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
                            {/* Left: Tabs/Body */}
                            <div className="md:col-span-7 p-6 border-r border-slate-800">
                                <div className="flex gap-6 border-b border-slate-800 mb-6">
                                    {['PARAMS', 'HEADERS', 'BODY'].map(t => (
                                        <button key={t} className={`pb-2 text-xs font-bold tracking-widest ${t === 'BODY' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-500'}`}>{t}</button>
                                    ))}
                                </div>
                                <div className="font-mono text-sm text-slate-400 leading-relaxed">
                                    <div className="text-yellow-500">{'{'}</div>
                                    <div className="pl-4">
                                        <span className="text-sky-400">"username"</span>: <span className="text-emerald-400">"dong4j"</span>,<br/>
                                        <span className="text-sky-400">"role"</span>: <span className="text-emerald-400">"admin"</span>
                                    </div>
                                    <div className="text-yellow-500">{'}'}</div>
                                </div>
                                <button onClick={handleSend} className="mt-8 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-all flex items-center gap-2">
                                    {requestStatus === 'loading' ? <RefreshCw className="animate-spin w-4 h-4"/> : <Play className="w-4 h-4 fill-current"/>}
                                    SEND REQUEST
                                </button>
                            </div>
                            {/* Right: Response */}
                            <div className="md:col-span-5 bg-[#0c0c0e] p-6 relative">
                                <div className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Response</div>
                                {requestStatus === 'success' ? (
                                    <div className="font-mono text-sm animate-in fade-in slide-in-from-right-2">
                                        <div className="text-emerald-400 font-bold mb-4">200 OK (145ms)</div>
                                        <div className="text-yellow-500">{'{'}</div>
                                        <div className="pl-4">
                                            <span className="text-sky-400">"id"</span>: <span className="text-orange-400">1024</span>,<br/>
                                            <span className="text-sky-400">"status"</span>: <span className="text-emerald-400">"success"</span>
                                        </div>
                                        <div className="text-yellow-500">{'}'}</div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-700">
                                        <Layout className="w-12 h-12 opacity-20 mb-4"/>
                                        <span className="text-xs uppercase tracking-widest">Waiting for request...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-white"/>
                </div>
            </section>


            {/* --- Section 4: CTA --- */}
            <section className="h-full w-full snap-start flex items-center justify-center bg-[#050505] relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-950/5"></div>
                <div className="max-w-4xl text-center px-6 relative z-10">
                    <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-10 border border-amber-500/20">
                        <Globe className="w-12 h-12 text-amber-500"/>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                        API Dev,<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Accelerated.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                        <button className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xl transition-all shadow-[0_0_40px_rgba(217,119,6,0.2)]">
                            {t('plugins.swagger.installButton')}
                        </button>
                    </div>

                    <div className="mt-20 flex justify-center gap-12 text-slate-600 font-mono text-xs uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> OpenAPI 3.0</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Postman Ready</div>
                    </div>
                </div>
            </section>

        </div>
    );
};
