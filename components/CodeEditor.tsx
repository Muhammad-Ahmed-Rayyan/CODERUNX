
import React, { useEffect, useRef, useMemo } from 'react';
import { Code2, Download } from 'lucide-react';
import Prism from 'prismjs';
import { Theme } from '../types';

// Load Prism languages
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

interface Props {
  code: string;
  onChange: (val: string) => void;
  onDownload?: () => void;
  readOnly?: boolean;
  filename: string;
  theme: Theme;
}

const CodeEditor: React.FC<Props> = ({ code, onChange, onDownload, readOnly, filename, theme }) => {
  const lineCount = useMemo(() => (code.match(/\n/g) || []).length + 1, [code]);
  const extension = filename.split('.').pop()?.toLowerCase() || 'text';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const getLanguage = (ext: string) => {
    switch (ext) {
      case 'py': return 'python';
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'jsx';
      case 'tsx': return 'tsx';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'javascript';
    }
  };

  const language = getLanguage(extension);

  // Sync scroll
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const isDark = theme === 'dark';

  const styles = {
    editorBg: isDark ? '#0f172a' : '#ffffff',
    toolbarBg: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
    lineNumBg: isDark ? '#0f172a' : '#ffffff',
    lineNumText: isDark ? '#475569' : '#94a3b8',
    filenameText: isDark ? '#cbd5e1' : '#475569',
    badgeBg: isDark ? '#334155' : '#f1f5f9',
    badgeText: isDark ? '#94a3b8' : '#64748b',
    caret: isDark ? '#60a5fa' : '#2563eb',
    selection: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.1)',
  };

  const highlightedHtml = useMemo(() => {
    const grammer = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(code, grammer, language);
  }, [code, language]);

  // Ensure highlight reflects scrolling if content changes
  useEffect(() => {
    handleScroll();
  }, [highlightedHtml]);

  return (
    <div className="flex flex-col h-full transition-all duration-300 min-h-0 overflow-hidden" style={{ backgroundColor: styles.editorBg }}>
      <div className="flex items-center justify-between px-4 py-2 border-b shrink-0 z-10" style={{ backgroundColor: styles.toolbarBg, borderColor: styles.border }}>
        <div className="flex items-center gap-2 overflow-hidden">
          <Code2 size={14} className="text-[#4f772d] shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-widest truncate" style={{ color: styles.filenameText }}>{filename}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {onDownload && (
            <button 
              onClick={onDownload}
              title="Download File"
              className="p-1 rounded transition-colors hover:bg-[#4f772d]/10"
              style={{ color: styles.badgeText }}
            >
              <Download size={14} />
            </button>
          )}
          <div className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-current opacity-60" style={{ color: styles.badgeText }}>
            {extension.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden min-h-0">
        <div className="text-right px-4 py-4 select-none border-r min-w-[3.5rem] font-mono text-[12px] leading-6 shrink-0" style={{ backgroundColor: styles.lineNumBg, borderColor: styles.border, color: styles.lineNumText }}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden h-full">
          <pre
            ref={preRef}
            aria-hidden="true"
            className={`language-${language} absolute inset-0 p-4 m-0 pointer-events-none whitespace-pre font-mono text-[13px] leading-6 overflow-hidden theme-${theme}`}
            style={{ 
                background: 'transparent',
                fontFamily: '"JetBrains Mono", monospace'
            }}
            dangerouslySetInnerHTML={{ __html: `<code class="language-${language}">${highlightedHtml}${code.endsWith('\n') ? ' ' : ''}</code>` }}
          />

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            readOnly={readOnly}
            spellCheck={false}
            autoFocus
            className="absolute inset-0 w-full h-full bg-transparent p-4 m-0 outline-none resize-none font-mono text-[13px] leading-6 overflow-auto custom-scrollbar whitespace-pre"
            style={{ 
                fontFamily: '"JetBrains Mono", monospace',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                caretColor: styles.caret
            }}
            placeholder="// Start coding here..."
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .theme-dark .token.comment { color: #6a9955; font-style: italic; }
        .theme-dark .token.punctuation { color: #94a3b8; }
        .theme-dark .token.property, .theme-dark .token.tag, .theme-dark .token.boolean, .theme-dark .token.number, .theme-dark .token.constant, .theme-dark .token.symbol, .theme-dark .token.deleted { color: #b5cea8; }
        .theme-dark .token.selector, .theme-dark .token.attr-name, .theme-dark .token.string, .theme-dark .token.char, .theme-dark .token.builtin, .theme-dark .token.inserted { color: #ce9178; }
        .theme-dark .token.operator, .theme-dark .token.entity, .theme-dark .token.url { color: #cbd5e1; }
        .theme-dark .token.atrule, .theme-dark .token.attr-value, .theme-dark .token.keyword { color: #569cd6; font-weight: 600; }
        .theme-dark .token.function, .theme-dark .token.class-name { color: #dcdcaa; }
        .theme-dark .token.regex, .theme-dark .token.variable { color: #d16969; }

        .theme-light .token.comment { color: #008000; font-style: italic; }
        .theme-light .token.punctuation { color: #334155; }
        .theme-light .token.property, .theme-light .token.tag, .theme-light .token.boolean, .theme-light .token.number, .theme-light .token.constant, .theme-light .token.symbol, .theme-light .token.deleted { color: #098658; }
        .theme-light .token.selector, .theme-light .token.attr-name, .theme-light .token.string, .theme-light .token.char, .theme-light .token.builtin, .theme-light .token.inserted { color: #a31515; }
        .theme-light .token.operator, .theme-light .token.entity, .theme-light .token.url { color: #334155; }
        .theme-light .token.atrule, .theme-light .token.attr-value, .theme-light .token.keyword { color: #0000ff; font-weight: 600; }
        .theme-light .token.function, .theme-light .token.class-name { color: #795e26; }
        .theme-light .token.regex, .theme-light .token.variable { color: #ee0000; }

        textarea::selection { background-color: ${styles.selection}; }
        
        .theme-dark.language-javascript .token.keyword, .theme-dark.language-typescript .token.keyword { color: #c586c0; }
        .theme-light.language-javascript .token.keyword, .theme-light.language-typescript .token.keyword { color: #af00db; }

        textarea, pre, code {
          font-family: "JetBrains Mono", monospace !important;
          font-variant-ligatures: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .theme-dark .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .theme-dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 5px; border: 2px solid #0f172a; }
        .theme-light .custom-scrollbar::-webkit-scrollbar-track { background: #ffffff; }
        .theme-light .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; border: 2px solid #ffffff; }
      `}} />
    </div>
  );
};

export default CodeEditor;
