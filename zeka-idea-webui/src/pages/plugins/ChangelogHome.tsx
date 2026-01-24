import React, {useRef} from 'react';
import {
    ArrowDown,
    Calendar,
    Check,
    CheckSquare,
    ChevronDown,
    Code,
    Download,
    FileDiff,
    FileText,
    GitCommit,
    LayoutTemplate,
    List,
    MessageSquare,
    Sparkles,
    Terminal
} from 'lucide-react';

export const ChangelogHome: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({top: scrollRef.current.clientHeight, behavior: 'smooth'});
        }
    };

    return (
        // Changed to fixed positioning to eliminate double scrollbars and ensure smooth snapping
        <div ref={scrollRef} className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#F0FDF4] font-sans selection:bg-green-200 z-0">

            {/* --- Section 1: Hero --- */}
            <section className="h-full w-full snap-start flex flex-col md:flex-row relative">
                {/* Left Panel: Hero Content */}
                <div className="w-full md:w-1/2 p-12 lg:p-20 flex flex-col justify-center bg-[#DCFCE7] border-r border-[#BBF7D0] relative">
                    <div className="max-w-xl mx-auto md:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#166534] text-white text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
                            <GitCommit className="w-4 h-4"/>
                            IntelliAI Changelog
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-[#14532D] mb-8 leading-tight animate-fade-in-up delay-100">
                            Turn Git Commits
                            into <span className="text-[#16A34A] inline-block hover:scale-105 transition-transform cursor-default">Stories</span>.
                        </h1>

                        <p className="text-xl text-[#15803D] mb-12 font-medium leading-relaxed animate-fade-in-up delay-200">
                            No more copy-pasting from git log.
                            <br/>
                            Automatically generate structured changelogs, daily reports, and smart commit messages using AI.
                        </p>

                        <div className="space-y-8 animate-fade-in-up delay-300">
                            <FeatureItem
                                icon={Calendar}
                                title="Daily & Weekly Reports"
                                desc="Summarize your work for stand-ups instantly."
                            />
                            <FeatureItem
                                icon={List}
                                title="Semantic Changelogs"
                                desc="Group commits by feature, fix, or refactor automatically."
                            />
                            <FeatureItem
                                icon={FileDiff}
                                title="Smart Commit Messages"
                                desc="Let AI write your commit messages based on staged diffs."
                            />
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0 animate-bounce cursor-pointer z-20" onClick={scrollToNext}>
                        <ArrowDown className="w-6 h-6 text-green-700 opacity-50 hover:opacity-100 transition-opacity"/>
                    </div>
                </div>

                {/* Right Panel: Interactive Visuals */}
                <div className="w-full md:w-1/2 bg-[#F0FDF4] p-12 lg:p-20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(#15803D 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}></div>

                    <div className="relative w-full max-w-lg scale-90 lg:scale-100">
                        {/* Timeline Visual */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200"></div>

                        <div className="space-y-12 relative z-10">
                            {/* Input: Git Log */}
                            <div className="flex gap-8 group">
                                <div className="w-16 flex-shrink-0 flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-green-300 border-4 border-white shadow-sm mb-2 group-hover:bg-green-500 transition-colors"></div>
                                    <span className="text-xs text-green-600 font-mono">GIT LOG</span>
                                </div>
                                <div className="flex-1 bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-green-100 shadow-sm transition-all hover:shadow-md hover:border-green-300">
                                    <div className="font-mono text-xs text-gray-500 space-y-2">
                                        <p className="flex items-center gap-2"><span className="text-green-600 font-bold">e3f1a2</span> fix:
                                            null pointer in user service</p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-green-600 font-bold">8b2c9d</span> feat: add dark mode support</p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-green-600 font-bold">4a1d5c</span> refactor: optimize database query</p>
                                    </div>
                                </div>
                            </div>

                            {/* Processing AI */}
                            <div className="flex justify-center -my-6 pl-16">
                                <div className="p-3 bg-green-500 rounded-full text-white shadow-lg shadow-green-500/30 animate-pulse">
                                    <Sparkles className="w-6 h-6"/>
                                </div>
                            </div>

                            {/* Output: Report */}
                            <div className="flex gap-8">
                                <div className="w-16 flex-shrink-0 flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-green-600 border-4 border-white shadow-sm mb-2"></div>
                                    <span className="text-xs text-green-800 font-bold font-mono">REPORT</span>
                                </div>
                                <div className="flex-1 bg-white p-6 rounded-xl border border-green-200 shadow-xl transform transition-all hover:-translate-y-1 hover:shadow-2xl">
                                    <div className="flex items-center justify-between mb-4 border-b border-green-50 pb-2">
                                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600"/>
                                            Daily Report
                                        </h3>
                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Markdown</span>
                                    </div>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-1">
                                                <CheckSquare className="w-3.5 h-3.5"/> Completed Features
                                            </h4>
                                            <p className="text-gray-600 pl-6 leading-relaxed">• Implemented
                                                system-wide <span className="font-semibold text-gray-800">Dark Mode</span> support.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-1">
                                                <CheckSquare className="w-3.5 h-3.5"/> Bug Fixes
                                            </h4>
                                            <p className="text-gray-600 pl-6 leading-relaxed">•
                                                Resolved <code className="bg-red-50 text-red-600 px-1 rounded text-xs">NullPointerException</code> in
                                                UserService.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-1">
                                                <CheckSquare className="w-3.5 h-3.5"/> Optimization
                                            </h4>
                                            <p className="text-gray-600 pl-6 leading-relaxed">• Optimized DB queries
                                                (<span className="text-green-600 font-bold">+30% speedup</span>).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- Section 2: Features Deep Dive --- */}
            <section className="h-full w-full snap-start bg-[#ECFDF5] flex items-center justify-center relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left: Commit Message Generator */}
                    <div className="order-2 md:order-1 relative">
                        <div className="bg-[#1E293B] rounded-xl shadow-2xl border border-gray-700 overflow-hidden font-mono text-sm">
                            <div className="bg-[#0F172A] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-gray-400 text-xs">Commit Dialog</span>
                            </div>
                            <div className="p-6 text-gray-300 space-y-4">
                                <div className="space-y-1">
                                    <div className="text-gray-500 text-xs">Unstaged Changes:</div>
                                    <div className="text-blue-400 flex items-center gap-2">
                                        <FileDiff className="w-4 h-4"/> src/main/UserService.java
                                    </div>
                                    <div className="text-blue-400 flex items-center gap-2">
                                        <FileDiff className="w-4 h-4"/> src/test/UserTest.java
                                    </div>
                                </div>

                                <div className="h-px bg-gray-700 my-2"></div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Commit Message</span>
                                        <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                            <Sparkles className="w-3 h-3"/> AI Generate
                                        </button>
                                    </div>
                                    <div className="bg-[#0F172A] p-3 rounded border border-gray-700 text-green-400 border-l-4 border-l-green-500">
                                        feat(user): implement user validation logic<br/>
                                        <br/>
                                        - Added email format regex check<br/>
                                        - Updated unit tests for edge cases
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-lg shadow-xl border border-green-100 animate-bounce hidden md:block">
                            <div className="flex items-center gap-2 text-green-700 font-bold">
                                <Check className="w-5 h-5"/>
                                <span>Conventional Commits Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="order-1 md:order-2 space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-bold text-[#064E3B]">
                            Write Commits <br/>
                            <span className="text-[#10B981]">Without Writing.</span>
                        </h2>
                        <p className="text-lg text-[#065F46] leading-relaxed">
                            Stop staring at empty commit boxes. The AI analyzes your staged changes and generates concise, descriptive
                            messages following <strong>Conventional Commits</strong> standards.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Analyses diffs line-by-line',
                                'Detects breaking changes automatically',
                                'Supports custom commit templates',
                                'Multi-language support'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[#047857]">
                                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-green-700"/>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-green-700 opacity-30"/>
                </div>
            </section>


            {/* --- Section 3: Customizable Templates --- */}
            <section className="h-full w-full snap-start bg-[#F0FDF4] flex flex-col items-center justify-center relative">
                <div className="text-center max-w-3xl px-6 mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6 text-green-600">
                        <LayoutTemplate className="w-8 h-8"/>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#14532D] mb-6">Your Format, Your Rules.</h2>
                    <p className="text-xl text-[#15803D]">
                        Whether you need a simple bulleted list for Slack or a complex Markdown table for Jira,
                        our template engine has you covered.
                    </p>
                </div>

                <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:border-green-300 transition-all hover:-translate-y-2 group">
                        <div className="h-10 w-10 bg-[#DCFCE7] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#22c55e] transition-colors">
                            <MessageSquare className="w-5 h-5 text-[#15803D] group-hover:text-white"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">For Slack / Teams</h3>
                        <p className="text-gray-500 text-sm mb-4">Concise bullet points focusing on "What changed". Perfect for daily
                            standups.</p>
                        <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-600 border border-gray-100">
                            *Today's Updates*<br/>
                            • Fixed login bug<br/>
                            • Added user profile
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:border-green-300 transition-all hover:-translate-y-2 group relative">
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                        <div className="h-10 w-10 bg-[#DCFCE7] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#22c55e] transition-colors">
                            <FileText className="w-5 h-5 text-[#15803D] group-hover:text-white"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">For Release Notes</h3>
                        <p className="text-gray-500 text-sm mb-4">Categorized by type (Features, Fixes) with links to issues. Professional
                            and clean.</p>
                        <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-600 border border-gray-100">
                            ## 🚀 Features<br/>
                            - Auth: OAuth2 support<br/><br/>
                            ## 🐛 Fixes<br/>
                            - API: Timeout handling
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:border-green-300 transition-all hover:-translate-y-2 group">
                        <div className="h-10 w-10 bg-[#DCFCE7] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#22c55e] transition-colors">
                            <Code className="w-5 h-5 text-[#15803D] group-hover:text-white"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Freemarker</h3>
                        <p className="text-gray-500 text-sm mb-4">Full control with Freemarker templates. Access commit hash, author, date,
                            and more.</p>
                        <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-600 border border-gray-100">
                            {'{#commits}'}<br/>
                            [{'{shortHash}'}] {'{msg}'}<br/>
                            {'{/commits}'}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 animate-bounce cursor-pointer" onClick={scrollToNext}>
                    <ChevronDown className="w-8 h-8 text-green-700 opacity-30"/>
                </div>
            </section>


            {/* --- Section 4: CTA --- */}
            <section className="h-full w-full snap-start bg-[#14532D] flex items-center justify-center text-white relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="max-w-4xl text-center px-6 relative z-10">
                    <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight">
                        Start saving time today.
                    </h2>
                    <p className="text-xl lg:text-2xl text-green-100 mb-12 max-w-2xl mx-auto">
                        Join thousands of developers who have stopped writing manual reports and started coding more.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-10 py-5 bg-white text-[#14532D] rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3">
                            <Download className="w-6 h-6"/>
                            Install for IntelliJ IDEA
                        </button>
                        <button className="px-10 py-5 bg-[#166534] text-white border border-[#16A34A] rounded-xl font-bold text-lg hover:bg-[#15803D] transition-all flex items-center justify-center gap-3">
                            <Terminal className="w-6 h-6"/>
                            Documentation
                        </button>
                    </div>

                    <div className="mt-16 pt-8 border-t border-green-800 flex justify-center gap-12 opacity-60">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">50k+</div>
                            <div className="text-xs uppercase tracking-wider">Downloads</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">4.8</div>
                            <div className="text-xs uppercase tracking-wider">Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">100%</div>
                            <div className="text-xs uppercase tracking-wider">Open Source</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

const FeatureItem: React.FC<{ icon: React.ElementType, title: string, desc: string }> = ({icon: Icon, title, desc}) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors cursor-default">
        <div className="p-3 bg-white rounded-lg shadow-sm border border-green-100">
            <Icon className="w-6 h-6 text-green-600"/>
        </div>
        <div>
            <h3 className="text-lg font-bold text-[#14532D] mb-1">{title}</h3>
            <p className="text-[#166534] text-sm leading-relaxed opacity-90">{desc}</p>
        </div>
    </div>
);
