
import React, { useState, useEffect } from 'react';
import { Cpu, Globe, Layers, ShieldCheck, SquareTerminal } from 'lucide-react';
import { Theme } from '../types';

interface Props {
  theme: Theme;
}

const statusMessages = [
  "Initializing secure neural sandbox...",
  "Allocating enterprise compute resources...",
  "Bootstrapping environment manifest...",
  "Synchronizing multi-file project workspace...",
  "Establishing AI logic feedback loops...",
  "Readying polyglot execution engine...",
  "Configuring terminal interface...",
  "Finalizing workspace parameters..."
];

const SetupLoader: React.FC<Props> = ({ theme }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 800);

    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const step = prev > 85 ? 0.35 : 0.85;
        return prev + step;
      });
    }, 50);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4f772d]/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center max-w-sm w-full px-8">
        {/* Animated Central Logo */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-[#4f772d]/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-[#4f772d] p-8 rounded-[3rem] shadow-2xl shadow-[#4f772d]/40 ring-8 ring-white dark:ring-slate-900 overflow-hidden group">
            <SquareTerminal size={56} className="text-white animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-4 w-full">
          <h2 className="text-[10px] font-black text-[#4f772d] dark:text-[#6a9e3b] uppercase tracking-[0.4em] mb-1">
            Setting up environment
          </h2>
          
          <div className="h-6 flex items-center justify-center overflow-hidden">
             <p className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in">
               {statusMessages[messageIndex]}
             </p>
          </div>

          {/* Modern Progress Bar */}
          <div className="relative w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
            <div 
              className="absolute top-0 left-0 h-full bg-[#4f772d] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between pt-8 gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <Cpu size={16} className="text-[#4f772d]" />
             <Globe size={16} className="text-[#3d5c22]" />
             <Layers size={16} className="text-[#6a9e3b]" />
             <ShieldCheck size={16} className="text-emerald-500" />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default SetupLoader;
