import React, {useEffect, useRef, useState} from 'react';
import {
    AlertTriangle,
    ChevronDown,
    Command,
    Download,
    Eye,
    FolderTree,
    GitBranch,
    Search,
    ShieldAlert,
    ShieldCheck,
    Terminal as TerminalIcon
} from 'lucide-react';
import {useTranslation} from 'react-i18next';

export const TerminalHome: React.FC = () => {
    const {t} = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    const [terminalState, setTerminalState] = useState({
        showPromptComment: false,
        typedComment: '',
        showAiAnalysis: false,
        showPromptCommand: false,
        typedCommand: ''
    });

    const commentText = t('plugins.terminal.demo.comment_text');
    const commandText = t('plugins.terminal.demo.command_text');

    useEffect(() => {
        let isCancelled = false;
        const runSequence = async () => {
            if (isCancelled) return;
            // Reset state
            setTerminalState({
                showPromptComment: true,
                typedComment: '',
                showAiAnalysis: false,
                showPromptCommand: false,
                typedCommand: ''
            });

            // 1. Type Comment
            for (let i = 0; i <= commentText.length; i++) {
                if (isCancelled) return;
                setTerminalState(prev => ({...prev, typedComment: commentText.slice(0, i)}));
                await new Promise(r => setTimeout(r, 50 + Math.random() * 30));
            }

            // Pause before AI analysis
            await new Promise(r => setTimeout(r, 500));

            // 2. Show AI Analysis
            if (isCancelled) return;
            setTerminalState(prev => ({...prev, showAiAnalysis: true}));

            // Simulate analysis time
            await new Promise(r => setTimeout(r, 1500));

            // 3. Show Command Prompt
            if (isCancelled) return;
            setTerminalState(prev => ({...prev, showPromptCommand: true}));

            // 4. Type Command
            for (let i = 0; i <= commandText.length; i++) {
                if (isCancelled) return;
                setTerminalState(prev => ({...prev, typedCommand: commandText.slice(0, i)}));
                await new Promise(r => setTimeout(r, 30 + Math.random() * 20));
            }

            // 5. Wait and restart
            await new Promise(r => setTimeout(r, 5000));
            runSequence();
        };

        runSequence();

        return () => {
            isCancelled = true;
        };
    }, [commentText, commandText]);

    return (
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#0a0a0a] text-[#33ff00] font-mono selection:bg-[#33ff00] selection:text-black z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start relative flex flex-col items-center justify-center overflow-hidden">
                 {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

                <div className="max-w-6xl w-full px-6 flex flex-col items-center relative z-10">
                    <div className="mb-8 inline-flex items-center gap-2 border border-[#33ff00] px-4 py-1.5 text-sm bg-[#33ff00]/5 rounded-sm animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#33ff00] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#33ff00]"></span>
                        </span>
                        <span className="tracking-widest">{t('plugins.terminal.system_online')}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight text-center animate-fade-in-up delay-100">
                        <span className="text-white">IntelliAI</span>
                        <span className="text-[#33ff00]">_Terminal</span>
                        <span className="animate-pulse text-[#33ff00]">_</span>
                    </h1>

                    <div className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 space-y-2 text-center animate-fade-in-up delay-200">
                         <p className="flex items-center justify-center gap-3 whitespace-nowrap">
                            <span className="text-[#33ff00]">$</span>
                            <span>{t('plugins.terminal.hero.tagline1')}</span>
                        </p>
                    </div>

                    {/* Interactive Terminal Demo - Centered */}
                    <div className="w-full max-w-3xl bg-[#0c0c0c] rounded-lg overflow-hidden shadow-2xl border border-gray-800 font-mono text-sm md:text-base relative group animate-fade-in-up delay-300">
                        {/* Terminal Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#33ff00] to-emerald-600 rounded-lg blur opacity-5 group-hover:opacity-10 transition duration-1000 group-hover:duration-200"></div>

                        {/* Terminal Bar */}
                        <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-gray-800 relative z-10">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <div className="ml-4 text-gray-500 text-[10px] flex-1 text-center font-mono tracking-tight">user@dev-machine: ~/projects/zeka-stack</div>
                        </div>

                        {/* Terminal Content */}
                        <div className="p-5 text-gray-300 min-h-[160px] relative z-10 flex flex-col justify-center text-left">
                            <div className="mb-2 h-6 flex items-center">
                                {terminalState.showPromptComment && (
                                    <>
                                        <span className="text-[#33ff00] mr-2">➜</span>
                                        <span className="text-[#39a0ed] mr-2">~</span>
                                        <span className="text-gray-500 italic">{terminalState.typedComment}</span>
                                        {!terminalState.showAiAnalysis && (
                                            <span className="animate-pulse bg-gray-500 w-2 h-4 inline-block ml-1 align-middle"></span>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="mb-4 h-8 flex items-center">
                                {terminalState.showAiAnalysis && (
                                    <div className="pl-4 border-l-2 border-[#33ff00]/30 text-xs text-gray-500 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <span className="text-[#33ff00]">[AI]</span> {t('plugins.terminal.demo.analyzing')}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4 h-6 flex items-center">
                                {terminalState.showPromptCommand && (
                                    <>
                                        <span className="text-[#33ff00] mr-2">➜</span>
                                        <span className="text-[#39a0ed] mr-2">~</span>
                                        <span className="text-white">{terminalState.typedCommand}</span>
                                        <span className="animate-pulse bg-[#33ff00] w-2.5 h-5 inline-block ml-1 align-middle shadow-[0_0_8px_rgba(51,255,0,0.8)]"></span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                     <div className="flex flex-col sm:flex-row gap-6 mt-12 animate-fade-in-up delay-500">
                        <button className="group relative px-8 py-4 bg-[#33ff00] text-black font-bold text-lg hover:bg-[#2adb00] transition-all">
                            <div className="absolute inset-0 border-2 border-[#33ff00] translate-x-1.5 translate-y-1.5 group-hover:translate-x-2.5 group-hover:translate-y-2.5 transition-transform bg-transparent content-[''] -z-10 border-dashed"></div>
                            <span className="flex items-center gap-2">
                                <Download className="w-5 h-5"/>
                                {t('plugins.terminal.hero.install_button')}
                            </span>
                        </button>
                    </div>

                </div>
                 <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-[#33ff00]"/>
                </div>
            </section>


            {/* --- Section 2: Context Awareness --- */}
            <section className="h-full w-full snap-start bg-[#050505] flex items-center justify-center relative border-t border-gray-900">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Left: Text */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                             {t('plugins.terminal.section2Title')} <span className="text-[#33ff00]">{t('plugins.terminal.section2Highlight')}</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                             {t('plugins.terminal.section2Desc')}
                        </p>
                        <ul className="space-y-6">
                            {[
                                {icon: FolderTree, text: t('plugins.terminal.contextFeature1')},
                                {icon: GitBranch, text: t('plugins.terminal.contextFeature2')},
                                {icon: Search, text: t('plugins.terminal.contextFeature3')},
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-300">
                                    <div className="w-12 h-12 rounded bg-[#33ff00]/10 flex items-center justify-center border border-[#33ff00]/20">
                                        <item.icon className="w-6 h-6 text-[#33ff00]"/>
                                    </div>
                                    <span className="text-lg">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Visual */}
                    <div className="order-1 md:order-2 relative">
                         {/* Abstract File Tree Visual */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#33ff00]/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 relative z-10 shadow-2xl">
                             <div className="flex gap-2 mb-4 border-b border-gray-800 pb-4">
                                 <div className="text-xs text-gray-500 font-mono">Project Context</div>
                             </div>
                             <div className="space-y-2 font-mono text-sm">
                                 <div className="flex items-center gap-2 text-gray-500">
                                     <FolderTree className="w-4 h-4"/> <span>src/main/java</span>
                                 </div>
                                 <div className="pl-6 flex items-center gap-2 text-gray-500">
                                     <FolderTree className="w-4 h-4"/> <span>com/example</span>
                                 </div>
                                 <div className="pl-12 flex items-center gap-2 text-white bg-[#33ff00]/10 p-1 rounded -mx-1">
                                     <span className="text-[#33ff00]">➜</span> <span>UserController.java</span> <span className="text-xs text-gray-500 ml-auto">Modified 2m ago</span>
                                 </div>
                                 <div className="pl-12 flex items-center gap-2 text-gray-500">
                                     <span>UserService.java</span>
                                 </div>
                             </div>

                             <div className="mt-8 pt-4 border-t border-gray-800">
                                 <div className="text-gray-400 italic mb-2">User asks: "Undo recent changes in controller"</div>
                                 <div className="bg-black p-3 rounded border border-[#33ff00]/30 text-[#33ff00]">
                                     git checkout src/main/java/.../UserController.java
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
                 <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-[#33ff00]"/>
                </div>
            </section>


            {/* --- Section 3: Safety --- */}
            <section className="h-full w-full snap-start bg-[#0a0a0a] flex flex-col items-center justify-center relative border-t border-gray-900">
                <div className="text-center max-w-4xl px-6 mb-16">
                     <div className="inline-flex items-center justify-center p-4 bg-red-900/20 rounded-full mb-6 border border-red-500/50">
                        <ShieldAlert className="w-10 h-10 text-red-500"/>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t('plugins.terminal.section3Title')} <span className="text-red-500">{t('plugins.terminal.section3Highlight')}</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('plugins.terminal.section3Desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl px-6 w-full">
                    {/* Card 1 */}
                    <div className="bg-[#0f0f0f] p-8 rounded-xl border border-red-900/30 hover:border-red-500/50 transition-colors group">
                        <AlertTriangle className="w-8 h-8 text-red-500 mb-6"/>
                        <h3 className="text-xl font-bold text-white mb-3">{t('plugins.terminal.safetyCard1Title')}</h3>
                         <p className="text-gray-500 text-sm mb-4">{t('plugins.terminal.safetyCard1Desc')}</p>
                        <div className="bg-black p-3 rounded border border-red-900/50 font-mono text-xs text-red-400">
                            WARNING: This command will delete all files. Proceed? [y/N]
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#0f0f0f] p-8 rounded-xl border border-gray-800 hover:border-[#33ff00]/50 transition-colors group">
                        <Eye className="w-8 h-8 text-[#33ff00] mb-6"/>
                         <h3 className="text-xl font-bold text-white mb-3">{t('plugins.terminal.safetyCard2Title')}</h3>
                         <p className="text-gray-500 text-sm mb-4">{t('plugins.terminal.safetyCard2Desc')}</p>
                        <div className="bg-black p-3 rounded border border-gray-800 font-mono text-xs text-gray-300">
                            <span className="text-[#33ff00]">Analysis:</span> This command scans ports 1-1000 using nmap...
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#0f0f0f] p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors group">
                        <TerminalIcon className="w-8 h-8 text-blue-500 mb-6"/>
                         <h3 className="text-xl font-bold text-white mb-3">{t('plugins.terminal.safetyCard3Title')}</h3>
                         <p className="text-gray-500 text-sm mb-4">{t('plugins.terminal.safetyCard3Desc')}</p>
                        <div className="flex gap-2 mt-4">
                            {['bash', 'zsh', 'fish', 'pwsh'].map(sh => (
                                <span key={sh} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{sh}</span>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="absolute bottom-8 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-[#33ff00]"/>
                </div>
            </section>


            {/* --- Section 4: CTA --- */}
            <section className="h-full w-full snap-start flex items-center justify-center bg-[#050505] relative border-t border-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#33ff00]/10 via-transparent to-transparent"></div>

                <div className="text-center relative z-10 px-6">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                        Stop Memorizing.<br/>
                        <span className="text-[#33ff00]">Start Typing.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                         <button className="px-12 py-5 bg-[#33ff00] text-black font-bold text-xl rounded hover:bg-[#2adb00] transition-all shadow-[0_0_30px_rgba(51,255,0,0.3)] hover:shadow-[0_0_50px_rgba(51,255,0,0.5)]">
                             {t('plugins.terminal.hero.install_button')}
                         </button>
                         <button className="px-12 py-5 bg-transparent border-2 border-gray-700 text-white font-bold text-xl rounded hover:border-[#33ff00] hover:text-[#33ff00] transition-all">
                             {t('plugins.terminal.hero.docs_button')}
                         </button>
                    </div>

                    <div className="mt-16 flex justify-center gap-8 text-gray-600 font-mono text-sm">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4"/> Secure & Local
                        </div>
                        <div className="flex items-center gap-2">
                            <Command className="w-4 h-4"/> 100+ Templates
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
