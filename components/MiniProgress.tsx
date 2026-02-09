
import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppStatus } from '../types';

interface Props {
  status: AppStatus;
}

const steps = [
  { id: AppStatus.ANALYZING, label: 'Analysis' },
  { id: AppStatus.RUNNING, label: 'Execution' },
  { id: AppStatus.FIXING, label: 'AI Repair' },
  { id: AppStatus.TESTING, label: 'Verification' },
];

const MiniProgress: React.FC<Props> = ({ status }) => {
  const activeIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl min-w-[160px] animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-3">
        {steps.map((step, idx) => {
          const isActive = step.id === status;
          const isCompleted = idx < activeIndex || status === AppStatus.SUCCESS;
          const isError = status === AppStatus.FAILED && idx === activeIndex;

          return (
            <div key={step.id} className={`flex items-center gap-3 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-1' : 'opacity-30'}`}>
              <div className={`shrink-0 w-4 h-4 flex items-center justify-center`}>
                {isActive ? (
                  <Loader2 size={14} className="animate-spin text-[#4f772d]" />
                ) : isCompleted ? (
                  <CheckCircle2 size={14} className="text-slate-400 dark:text-slate-500" />
                ) : isError ? (
                  <AlertCircle size={14} className="text-rose-500" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                )}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${
                isActive ? 'text-[#4f772d] dark:text-[#6a9e3b]' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniProgress;
