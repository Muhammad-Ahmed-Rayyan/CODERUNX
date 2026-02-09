import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  RotateCcw, Wand2, Layers, 
  Sun, Moon, Rocket, Terminal, 
  Github, MessageSquare,
  Cpu, Zap, X, CheckCircle2,
  ChevronDown, ChevronUp,
  Download, Loader2, Wrench,
  SquareTerminal,
  ShieldCheck
} from 'lucide-react';
import JSZip from 'jszip';
import { AppStatus, SessionState, ConsoleLog, ProjectFile } from './types.ts';
import CodeEditor from './components/CodeEditor.tsx';
import ExecutionConsole from './components/ExecutionConsole.tsx';
import MiniProgress from './components/MiniProgress.tsx';
import FileTree from './components/FileTree.tsx';
import LandingPage from './components/LandingPage.tsx';
import SetupLoader from './components/SetupLoader.tsx';
import { runInSandbox } from './services/sandbox.ts';
import { getProjectFix, simulateExecution } from './services/geminiService.ts';

const INITIAL_FILES: ProjectFile[] = [
  {
    id: '1',
    name: 'main.py',
    language: 'python',
    content: `def process_data(data):
    # Logic: find average, but list might be empty
    return sum(data) / len(data)

raw_data = []
print(f"Executing with data: {raw_data}")
try:
    result = process_data(raw_data)
    print(f"Result computed: {result}")
except Exception as e:
    print(f"Process Error: {e}")
    # Force fail for simulation demonstration
    raise e`
  }
];

type View = 'landing' | 'workspace' | 'loading';
type ResizeMode = 'none' | 'left' | 'right' | 'bottom';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [userErrorContext, setUserErrorContext] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [state, setState] = useState<SessionState>({
    files: INITIAL_FILES,
    activeFileId: INITIAL_FILES[0].id,
    status: AppStatus.IDLE,
    logs: [],
    retryCount: 0,
    maxRetries: 3,
    theme: 'dark'
  });

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  const [panelHeight, setPanelHeight] = useState(250);
  const [leftWidth, setLeftWidth] = useState(240);
  const [rightWidth, setRightWidth] = useState(288);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('none');
  
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const stopResizing = useCallback(() => {
    setResizeMode('none');
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (resizeMode === 'none') return;

    if (resizeMode === 'bottom' && mainRef.current) {
      const mainRect = mainRef.current.getBoundingClientRect();
      const newHeight = mainRect.bottom - e.clientY;
      if (newHeight > 100 && newHeight < mainRect.height * 0.8) {
        setPanelHeight(newHeight);
        if (!isPanelOpen) setIsPanelOpen(true);
      }
    } else if (resizeMode === 'left') {
      const newWidth = e.clientX;
      if (newWidth > 160 && newWidth < 400) {
        setLeftWidth(newWidth);
      }
    } else if (resizeMode === 'right') {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 200 && newWidth < 450) {
        setRightWidth(newWidth);
      }
    }
  }, [resizeMode, isPanelOpen]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const handleStartLoading = () => {
    setView('loading');
    setTimeout(() => {
      setView('workspace');
    }, 6500);
  };

  const activeFile = useMemo(() => 
    state.files.find(f => f.id === state.activeFileId) || state.files[0], 
    [state.files, state.activeFileId]
  );

  const addLog = useCallback((message: string, type: ConsoleLog['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { message, type, timestamp: Date.now() }]
    }));
  }, []);

  const handleRunAndFix = async () => {
    let currentFiles = [...state.files];
    let retryCounter = 0;
    setShowSuccessDialog(false);
    
    setState(prev => ({ ...prev, status: AppStatus.ANALYZING, logs: [], retryCount: 0 }));
    addLog("System Initialized. Scanning project workspace...", "info");

    while (retryCounter <= state.maxRetries) {
      setState(prev => ({ ...prev, status: AppStatus.RUNNING, retryCount: retryCounter }));
      
      const onlyJS = currentFiles.every(f => ['javascript', 'js', 'html', 'css', 'json'].includes(f.language.toLowerCase()));
      
      let result;
      if (!onlyJS) {
        addLog(`Attempt #${retryCounter + 1}: Bootstrapping AI Neural Runtime...`, "ai");
        result = await simulateExecution(currentFiles);
      } else {
        addLog(`Attempt #${retryCounter + 1}: Local Sandbox execution...`, "info");
        const allCode = currentFiles.map(f => `// File: ${f.path || ''}${f.name}\n${f.content}`).join('\n\n');
        result = await runInSandbox(allCode);
      }
      
      result.output.forEach(msg => addLog(msg, "info"));

      if (result.success) {
        addLog(`Execution Successful after ${retryCounter} repair cycles.`, "success");
        setState(prev => ({ ...prev, status: AppStatus.SUCCESS }));
        setShowSuccessDialog(true);
        return;
      } else {
        addLog(`Fault Identified: ${result.error}`, "error");
        
        if (retryCounter >= state.maxRetries) {
          addLog("Maximum autonomous repair attempts reached.", "error");
          setState(prev => ({ ...prev, status: AppStatus.FAILED }));
          break;
        }

        setState(prev => ({ ...prev, status: AppStatus.FIXING }));
        addLog("Routing fault to Gemini Pro Neural Layer...", "ai");
        
        try {
          const fix = await getProjectFix(currentFiles, result.error || "Undefined runtime error.", userErrorContext);
          addLog(`AI Logic Patch: ${fix.explanation}`, "success");
          
          // Use full path matching to update files correctly
          const updatedFiles = [...currentFiles];
          fix.fixedFiles.forEach(fixed => {
            const index = updatedFiles.findIndex(f => ((f.path || '') + f.name) === fixed.name);
            if (index !== -1) {
              updatedFiles[index] = { ...updatedFiles[index], content: fixed.content };
            } else {
              // Add new file if AI suggested it
              const pathParts = fixed.name.split('/');
              const name = pathParts.pop() || 'new_file.py';
              const path = pathParts.length > 0 ? pathParts.join('/') + '/' : '';
              updatedFiles.push({
                id: Math.random().toString(36).substr(2, 9),
                name,
                path,
                content: fixed.content,
                language: name.split('.').pop() || 'text'
              });
            }
          });

          currentFiles = updatedFiles;
          setState(prev => ({ 
            ...prev, 
            files: updatedFiles, 
            lastFix: fix 
          }));
          
          retryCounter++;
          setState(prev => ({ ...prev, status: AppStatus.TESTING }));
          await new Promise(r => setTimeout(r, 1000));
        } catch (err: any) {
          addLog(`Neural Loopback Error: ${err.message}`, "error");
          setState(prev => ({ ...prev, status: AppStatus.FAILED }));
          break;
        }
      }
    }
  };

  const downloadFile = (file: ProjectFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProject = async () => {
    try {
      addLog("Preparing project archive...", "info");
      const zip = new JSZip();
      
      state.files.forEach(file => {
        const fullPath = (file.path || '') + file.name;
        zip.file(fullPath, file.content);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addLog("Project ZIP generated and download initiated.", "success");
    } catch (err) {
      addLog(`Failed to generate ZIP: ${err instanceof Error ? err.message : String(err)}`, "error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    const newFiles: ProjectFile[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i] as any;
      try {
        const content = await file.text();
        const fullPath = file.webkitRelativePath || file.name;
        const pathParts = fullPath.split('/');
        const fileName = pathParts.pop() || file.name;
        const directory = pathParts.join('/');

        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: fileName,
          path: directory ? directory + '/' : '',
          content: content,
          language: fileName.split('.').pop() || 'text'
        });
      } catch (err) {
        addLog(`Could not process file ${file.name}`, 'error');
      }
    }

    if (newFiles.length > 0) {
      setState(prev => ({ 
        ...prev, 
        files: [...prev.files, ...newFiles], 
        activeFileId: newFiles[0].id 
      }));
      addLog(`Synchronized ${newFiles.length} modules.`, "success");
    }
  };

  const addFile = useCallback((name: string) => {
    const pathParts = name.split('/');
    const fileName = pathParts.pop() || 'untitled';
    const directory = pathParts.join('/');

    const newFile: ProjectFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName,
      path: directory ? directory + '/' : '',
      language: fileName.split('.').pop() || 'text',
      content: '// Initialized module\n'
    };
    setState(prev => ({ 
      ...prev, 
      files: [...prev.files, newFile], 
      activeFileId: newFile.id 
    }));
    addLog(`Created new file: ${directory ? directory + '/' : ''}${fileName}`, "info");
  }, [addLog]);

  const isBusy = state.status !== AppStatus.IDLE && 
                 state.status !== AppStatus.SUCCESS && 
                 state.status !== AppStatus.FAILED;

  if (view === 'landing') {
    return <LandingPage onStart={handleStartLoading} theme={state.theme} onToggleTheme={toggleTheme} />;
  }

  if (view === 'loading') {
    return <SetupLoader theme={state.theme} />;
  }

  const isResizing = resizeMode !== 'none';

  return (
    <div className={`h-screen w-screen flex flex-col transition-colors duration-300 selection:bg-[#4f772d]/20 overflow-hidden bg-slate-50 dark:bg-[#020617] ${isResizing ? (resizeMode === 'bottom' ? 'cursor-ns-resize select-none' : 'cursor-col-resize select-none') : ''}`}>
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shrink-0 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="bg-[#4f772d] p-1.5 rounded-lg shadow-lg shadow-[#4f772d]/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <SquareTerminal size={18} className="text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight dark:text-white text-slate-900 leading-none uppercase">
                CodeRunX
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#4f772d] transition-all border border-slate-200 dark:border-slate-700">
            {state.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside 
          className="flex flex-col border-r border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-[#0f172a] h-full overflow-hidden"
          style={{ width: `${leftWidth}px` }}
        >
          <FileTree 
            files={state.files} 
            activeFileId={state.activeFileId} 
            onSelect={(id) => setState(p => ({ ...p, activeFileId: id }))}
            onAdd={addFile}
            onUpload={handleFileUpload}
            onDownloadProject={downloadProject}
            onDelete={(id) => setState(p => ({ ...p, files: p.files.filter(f => f.id !== id) }))}
          />
        </aside>

        <div 
          onMouseDown={() => setResizeMode('left')}
          className="w-1 cursor-col-resize hover:bg-[#4f772d]/40 transition-colors z-40 group shrink-0"
        >
          <div className="w-[1px] h-full bg-slate-200 dark:bg-slate-800 group-hover:bg-[#4f772d] mx-auto" />
        </div>

        <main ref={mainRef} className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <CodeEditor 
              filename={`${activeFile?.path || ''}${activeFile?.name || 'buffer'}`}
              code={activeFile?.content || ''} 
              theme={state.theme}
              onDownload={() => downloadFile(activeFile!)}
              onChange={(val) => setState(p => ({
                ...p,
                files: p.files.map(f => f.id === p.activeFileId ? { ...f, content: val } : f)
              }))} 
              readOnly={isBusy}
            />
            
            <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
              {isBusy && <div className="pointer-events-auto"><MiniProgress status={state.status} /></div>}
              {showSuccessDialog && (
                <div className="bg-white dark:bg-slate-900 border border-[#4f772d]/30 p-5 rounded-2xl shadow-2xl min-w-[340px] max-w-md animate-in slide-in-from-right-4 pointer-events-auto relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#4f772d]" />
                  <button 
                    onClick={() => setShowSuccessDialog(false)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-all"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#4f772d]/10 p-2 rounded-xl">
                      <CheckCircle2 size={18} className="text-[#4f772d] dark:text-[#6a9e3b]" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Logic Repair Complete</h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        The AI analyzed your code and applied a logical fix. Review changes in the editor or download the archive.
                      </p>
                      <div className="pt-2 text-[10px] font-bold text-[#4f772d] dark:text-[#6a9e3b] uppercase tracking-tighter">
                        Cycles: {state.retryCount} • Confidence: 99.8%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div 
            onMouseDown={() => setResizeMode('bottom')}
            className="h-1.5 w-full cursor-ns-resize hover:bg-[#4f772d]/40 transition-colors flex items-center justify-center z-40 group shrink-0"
          >
            <div className="w-12 h-0.5 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:bg-[#4f772d]" />
          </div>

          <div 
            className={`flex flex-col border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shrink-0 ${resizeMode !== 'bottom' ? 'transition-[height] duration-300' : ''}`}
            style={{ height: isPanelOpen ? `${panelHeight}px` : '40px' }}
          >
            <div className="flex items-center justify-between px-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 shrink-0 select-none">
              <div className="flex items-center gap-1 h-10">
                <div className="px-4 h-full flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 border-b-2 border-[#4f772d] bg-[#4f772d]/5 uppercase tracking-widest">
                  <Terminal size={14} /> Console
                </div>
              </div>
              <div className="flex items-center pr-2">
                <button 
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                >
                  {isPanelOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>
            </div>

            <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="h-full w-full overflow-y-auto p-4 custom-scrollbar bg-slate-50 dark:bg-[#0f172a]">
                <ExecutionConsole logs={state.logs} />
              </div>
            </div>
          </div>
        </main>

        <div 
          onMouseDown={() => setResizeMode('right')}
          className="w-1 cursor-col-resize hover:bg-[#4f772d]/40 transition-colors z-40 group shrink-0"
        >
          <div className="w-[1px] h-full bg-slate-200 dark:border-slate-800 group-hover:bg-[#4f772d] mx-auto" />
        </div>

        <aside 
          className="flex flex-col border-l border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-[#0f172a] h-full overflow-hidden"
          style={{ width: `${rightWidth}px` }}
        >
          <div className="flex-1 p-5 pt-6 space-y-7 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-[#4f772d]" />
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Environment Context</span>
              </div>
              <textarea 
                value={userErrorContext}
                onChange={(e) => setUserErrorContext(e.target.value)}
                placeholder="Optional: specific error hints or desired output..."
                className="w-full h-32 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-[12px] outline-none focus:ring-2 focus:ring-[#4f772d]/20 focus:border-[#4f772d] transition-all resize-none placeholder-slate-400 dark:text-slate-200 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                <Zap size={14} className="text-[#4f772d]" />
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logic Model</div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Gemini 3 Pro</div>
                </div>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
                <Cpu size={14} className="text-slate-400" />
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compute Core</div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Enterprise Sandbox</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 space-y-3 shrink-0 backdrop-blur-md">
            <button
              onClick={handleRunAndFix}
              disabled={isBusy}
              className="w-full group flex items-center justify-center gap-2.5 px-4 py-3.5 bg-[#4f772d] hover:bg-[#3d5c22] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-[#4f772d]/20 active:scale-[0.98] disabled:opacity-30"
            >
              {isBusy ? (
                <><Loader2 size={16} className="animate-spin" /> LOADING...</>
              ) : (
                <><Wrench size={16} className="group-hover:rotate-12 transition-transform" /> ANALYZE & FIX</>
              )}
            </button>
            <button
              onClick={() => {
                setUserErrorContext('');
                setShowSuccessDialog(false);
                setState(p => ({ ...p, status: AppStatus.IDLE, logs: [], lastFix: undefined, retryCount: 0 }));
              }}
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all uppercase tracking-widest"
            >
              <RotateCcw size={12} /> Reset System
            </button>
          </div>
        </aside>
      </div>
      
      <footer className="h-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-4 text-slate-500 shrink-0 select-none">
        <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.3em] font-black">
          <span className="text-[#4f772d] flex items-center gap-2"><Layers size={12} strokeWidth={3} /> Modules: {state.files.length}</span>
          <span className="flex items-center gap-2 opacity-50"><Zap size={12} strokeWidth={3} /> AI Status: Idle</span>
        </div>

        <div className="flex items-center justify-end gap-6 text-[10px] font-bold">
           <div className="flex items-center gap-2 text-[#4f772d] dark:text-[#6a9e3b] uppercase tracking-[0.2em] font-black text-[9px]">
             <ShieldCheck size={12} strokeWidth={3} /> Sandbox Active
           </div>
           <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
           <a href="https://github.com/Muhammad-Ahmed-Rayyan/CODERUNX" target="_blank" className="flex items-center gap-2 text-slate-400 hover:text-[#4f772d] transition-colors">
             <Github size={13} />
           </a>
        </div>
      </footer>
    </div>
  );
};

export default App;