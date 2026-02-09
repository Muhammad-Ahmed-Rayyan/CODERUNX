
import React from 'react';
import { CheckCircle2, XCircle, RefreshCw, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  success: boolean;
  retries: number;
  message: string;
  errorAnalysis?: string;
}

const ResultDisplay: React.FC<Props> = ({ success, retries, message, errorAnalysis }) => {
  return (
    <div className={`overflow-hidden rounded-xl border transition-all duration-300 ${
      success 
        ? 'bg-white dark:bg-slate-900 border-[#4f772d]/20 shadow-sm' 
        : 'bg-white dark:bg-slate-900 border-red-500/20 shadow-sm'
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-6">
          <div className={`p-3 rounded-lg shrink-0 ${
            success ? 'bg-[#4f772d]/10 text-[#4f772d]' : 'bg-red-500/10 text-red-500'
          }`}>
            {success ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`text-lg font-black tracking-tight ${success ? 'text-[#4f772d] dark:text-[#6a9e3b]' : 'text-red-600 dark:text-red-400'}`}>
                  {success ? 'STABILIZATION SUCCESSFUL' : 'REPAIR TERMINATED'}
                </h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${
                   success ? 'bg-[#4f772d]/20 text-[#4f772d]' : 'bg-red-500/20 text-red-500'
                }`}>
                  {success ? 'Verified' : 'Fault'}
                </span>
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <RefreshCw size={14} className="text-slate-400" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Repair Cycles</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{retries}</div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <BarChart3 size={14} className="text-slate-400" />
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Confidence</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{success ? '98%' : '14%'}</div>
                </div>
              </div>
            </div>

            {errorAnalysis && (
              <div className="bg-indigo-500/5 dark:bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-2 text-indigo-500">
                  <Lightbulb size={14} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Technical Insight</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic font-mono">
                  {errorAnalysis}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!success && (
        <div className="bg-red-500/5 border-t border-red-500/10 p-3 flex items-center justify-center gap-2">
          <AlertTriangle size={12} className="text-red-500/50" />
          <span className="text-[9px] font-bold text-red-500/60 uppercase tracking-widest">Manual logic verification suggested</span>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
