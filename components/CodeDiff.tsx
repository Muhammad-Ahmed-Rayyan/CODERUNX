
import React from 'react';
import { Sparkles, FileDiff, Zap } from 'lucide-react';

interface Props {
  original: string;
  fixed: string;
  explanation?: string;
}

const CodeDiff: React.FC<Props> = ({ original, fixed, explanation }) => {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-blue-500">
          <Sparkles size={16} />
          <h4 className="text-[10px] font-black uppercase tracking-widest">Patch Logic Summary</h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-l-2 border-slate-200 dark:border-slate-800 pl-3 py-1">
          {explanation || "Targeted patch applied based on runtime stack trace and logical analysis."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Modern side-by-side or stacked diff depending on screen, here we keep side-by-side for desktop style */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[9px] font-black text-red-500 uppercase tracking-wider">Before</span>
              <FileDiff size={12} className="text-slate-400" />
            </div>
            <pre className="p-4 text-[12px] font-mono text-slate-500 dark:text-slate-500 overflow-x-auto whitespace-pre overflow-y-auto max-h-[250px] custom-scrollbar">
              {original}
            </pre>
          </div>
          
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 border border-[#4f772d]/20 dark:border-[#4f772d]/10 rounded-xl overflow-hidden shadow-sm">
            <div className="px-3 py-2 bg-[#4f772d]/5 dark:bg-[#4f772d]/10 border-b border-[#4f772d]/10 flex justify-between items-center">
              <span className="text-[9px] font-black text-[#4f772d] uppercase tracking-wider">After (Applied)</span>
              <Zap size={12} className="text-[#4f772d]" />
            </div>
            <pre className="p-4 text-[12px] font-mono text-slate-800 dark:text-slate-100 overflow-x-auto whitespace-pre overflow-y-auto max-h-[250px] custom-scrollbar">
              {fixed}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDiff;
