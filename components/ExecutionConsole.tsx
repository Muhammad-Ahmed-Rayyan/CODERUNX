
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { ConsoleLog } from '../types';

interface Props {
  logs: ConsoleLog[];
}

const ExecutionConsole: React.FC<Props> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogStyle = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error': return 'text-rose-500 dark:text-rose-400/90';
      case 'success': return 'text-[#4f772d] dark:text-[#6a9e3b]';
      case 'warning': return 'text-amber-500 dark:text-amber-400/90';
      case 'ai': return 'text-[#4f772d] dark:text-[#6a9e3b] font-bold';
      case 'info': return 'text-slate-500 dark:text-slate-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="font-mono text-[12px] space-y-1 selection:bg-[#4f772d]/20">
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-300 dark:text-slate-800/50">
          <Terminal size={40} className="mb-4 opacity-20" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">Awaiting runtime initiation...</p>
        </div>
      )}
      {logs.map((log, idx) => (
        <div key={idx} className={`py-1 group transition-all duration-200`}>
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 shrink-0 mt-1 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="text-[9px] font-sans">
                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
               <div className="flex items-center gap-2">
                 {log.type === 'ai' && (
                   <span className="bg-[#4f772d]/10 text-[#4f772d] dark:text-[#6a9e3b] px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-[#4f772d]/20">AI</span>
                 )}
                 {log.type === 'error' && (
                   <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-rose-500/20">Fail</span>
                 )}
               </div>
               <pre className={`whitespace-pre-wrap break-all leading-relaxed font-mono ${getLogStyle(log.type)}`}>
                 {log.message}
               </pre>
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};

export default ExecutionConsole;
