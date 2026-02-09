import React from 'react';
import { 
  Rocket, RotateCcw, Github, Heart, Sparkles, Wand2, 
  Sun, Moon, Cpu, Zap, SquareTerminal
} from 'lucide-react';
import { Theme } from '../types';

interface Props {
  onStart: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, theme, onToggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-[#4f772d]/30 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4f772d]/10 dark:bg-[#4f772d]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4f772d]/5 dark:bg-[#4f772d]/5 blur-[120px] rounded-full" />
      </div>

      <header className="h-20 flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onStart}>
          <div className="bg-[#4f772d] p-2.5 rounded-2xl shadow-xl shadow-[#4f772d]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <SquareTerminal size={24} className="text-white relative z-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter leading-none uppercase">
            CodeRunX
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme} 
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#4f772d] transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={onStart}
            className="px-6 py-2.5 bg-[#4f772d] hover:bg-[#3d5c22] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#4f772d]/20 active:scale-95"
          >
            Launch Debugger
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f772d]/10 border border-[#4f772d]/20 text-[#4f772d] dark:text-[#6a9e3b] text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={12} /> Autonomous Debugging
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-slate-950 to-slate-500 dark:from-white dark:to-slate-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000">
            SHIP CODE FASTER.<br />LEAVE BUGS BEHIND.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            The enterprise-grade AI debugger that doesn't just find errors—it eliminates them. 
            Powered by high-reasoning neural models for autonomous repair loops.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-[#020617] dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#4f772d] dark:hover:bg-slate-50 transition-all shadow-2xl shadow-[#4f772d]/10 active:scale-95 flex items-center gap-3 group"
            >
              Get Started <Rocket size={20} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm border-y border-slate-200 dark:border-slate-900">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 hover:border-[#4f772d]/30 transition-all group shadow-sm">
              <div className="w-12 h-12 bg-[#4f772d]/10 rounded-2xl flex items-center justify-center text-[#4f772d] group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h4 className="text-xl font-black tracking-tight">NEURAL DIAGNOSTICS</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Uses Gemini 3 Pro reasoning layers to analyze multi-file architectures and find logical faults that traditional linters miss.
              </p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 hover:border-[#4f772d]/30 transition-all group shadow-sm">
              <div className="w-12 h-12 bg-[#4f772d]/10 rounded-2xl flex items-center justify-center text-[#4f772d] group-hover:scale-110 transition-transform">
                <Wand2 size={24} />
              </div>
              <h4 className="text-xl font-black tracking-tight">SELF-HEALING LOOPS</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Automated fix-and-test cycles. CodeRunX generates patches, executes them in a sandbox, and verifies the solution autonomously.
              </p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 hover:border-[#4f772d]/30 transition-all group shadow-sm">
              <div className="w-12 h-12 bg-[#4f772d]/10 rounded-2xl flex items-center justify-center text-[#4f772d] group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-black tracking-tight">POLYGLOT SANDBOX</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Execute Python, JavaScript, and more in an AI-simulated terminal. Zero configuration required for multi-file project simulation.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-900 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all">
            <div className="bg-[#4f772d] p-1.5 rounded-lg shadow-lg">
              <SquareTerminal size={14} className="text-white" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase">CodeRunX</span>
          </div>
          
          <p className="text-[13px] md:text-sm font-mono text-slate-500 dark:text-slate-400 tracking-wider text-center leading-relaxed">
            Made with <Heart size={14} className="inline mx-1 text-rose-500 fill-rose-500 animate-pulse" /> by{' '}
            <a 
              href="https://github.com/Muhammad-Ahmed-Rayyan" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-900 dark:text-slate-200 hover:text-[#4f772d] dark:hover:text-[#6a9e3b] underline decoration-[#4f772d]/30 transition-all font-bold"
            >
              Muhammad Ahmed Rayyan
            </a>{' '}
            | CODERUNX © 2026
          </p>

          <div className="flex items-center gap-6">
            <a href="https://github.com/Muhammad-Ahmed-Rayyan/CODERUNX" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <Github size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;