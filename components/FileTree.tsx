import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, Upload, Trash2, 
  FolderOpen, ChevronRight, ChevronDown, 
  Folder, FileCode2, Download,
  FolderPlus
} from 'lucide-react';
import { ProjectFile } from '../types.ts';

interface Props {
  files: ProjectFile[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
  onDownloadProject?: () => void;
}

interface TreeNode {
  name: string;
  files: ProjectFile[];
  folders: Map<string, TreeNode>;
  fullPath: string;
}

const FileTree: React.FC<Props> = ({ 
  files, 
  activeFileId, 
  onSelect, 
  onAdd, 
  onUpload, 
  onDelete,
  onDownloadProject 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const tree = useMemo(() => {
    const root: TreeNode = { name: 'root', files: [], folders: new Map(), fullPath: '' };
    files.forEach(file => {
      const path = file.path || '';
      const parts = path.split('/').filter(Boolean);
      let current = root;
      let accumulatedPath = '';
      parts.forEach(part => {
        accumulatedPath += part + '/';
        if (!current.folders.has(part)) {
          current.folders.set(part, { name: part, files: [], folders: new Map(), fullPath: accumulatedPath });
        }
        current = current.folders.get(part)!;
      });
      current.files.push(file);
    });
    return root;
  }, [files]);

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setExpandedFolders(next);
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const sortedFolders = Array.from(node.folders.values()).sort((a, b) => a.name.localeCompare(b.name));
    const sortedFiles = node.files.sort((a, b) => a.name.localeCompare(b.name));
    const isExpanded = expandedFolders.has(node.fullPath);

    return (
      <div key={node.fullPath || 'root'} className="flex flex-col">
        {node.fullPath && (
          <div 
            onClick={() => toggleFolder(node.fullPath)}
            className="group flex items-center gap-2 px-4 py-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-800/30 cursor-pointer text-slate-500 dark:text-slate-400 select-none transition-all"
            style={{ paddingLeft: `${depth * 10 + 12}px` }}
          >
            {isExpanded ? <ChevronDown size={11} className="shrink-0" /> : <ChevronRight size={11} className="shrink-0" />}
            <Folder size={14} className="text-[#4f772d]/70 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-wider truncate opacity-80">{node.name}</span>
          </div>
        )}
        
        {(isExpanded || !node.fullPath) && (
          <div className="flex flex-col">
            {sortedFolders.map(child => renderNode(child, depth + 1))}
            {sortedFiles.map(file => (
              <div
                key={file.id}
                onClick={() => onSelect(file.id)}
                className={`group flex items-center justify-between py-1.5 cursor-pointer transition-all duration-150 border-l-2 ${
                  activeFileId === file.id 
                    ? 'bg-[#4f772d]/5 border-[#4f772d] text-[#4f772d] dark:text-[#6a9e3b]' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/30'
                }`}
                style={{ paddingLeft: `${(depth + (node.fullPath ? 1 : 0)) * 10 + 16}px`, paddingRight: '12px' }}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileCode2 size={13} className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[12px] truncate font-medium tracking-tight">{file.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50">
        <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
          <FolderOpen size={10} className="text-[#4f772d]" /> Workspace
        </h2>
        <div className="flex gap-1">
          <button onClick={() => setIsAdding(true)} title="Add File" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-[#4f772d] transition-all"><Plus size={14} /></button>
          <label title="Upload Files" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-[#4f772d] cursor-pointer transition-all">
            <Upload size={14} />
            <input type="file" className="hidden" multiple onChange={onUpload} />
          </label>
          <label title="Upload Folder" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-[#4f772d] cursor-pointer transition-all">
            <FolderPlus size={14} />
            {/* Fix: Using an object spread with 'any' to bypass missing type definitions for webkitdirectory and directory attributes */}
            <input 
              type="file" 
              className="hidden" 
              {...({ webkitdirectory: "", directory: "" } as any)} 
              onChange={onUpload} 
            />
          </label>
          <button onClick={onDownloadProject} title="Export Project" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-[#4f772d] transition-all"><Download size={14} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {isAdding && (
          <div className="px-4 py-2 bg-[#4f772d]/5 border-l-2 border-[#4f772d] mb-1">
            <input ref={inputRef} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(newName.trim()); setNewName(''); setIsAdding(false); } if (e.key === 'Escape') setIsAdding(false); }} onBlur={() => !newName && setIsAdding(false)} placeholder="module.py" className="bg-transparent border-none outline-none text-[12px] text-slate-800 dark:text-slate-100 w-full font-medium" />
          </div>
        )}
        {files.length === 0 && !isAdding && <div className="px-4 py-12 text-center text-slate-400 dark:text-slate-800 text-[10px] font-black uppercase tracking-[0.3em] opacity-20">No Modules Detected</div>}
        {renderNode(tree)}
      </div>
    </div>
  );
};

export default FileTree;