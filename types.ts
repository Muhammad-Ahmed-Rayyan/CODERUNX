
export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RUNNING = 'RUNNING',
  FIXING = 'FIXING',
  TESTING = 'TESTING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export type Theme = 'dark' | 'light';

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: string;
  path?: string; // Relative path from project root
}

export interface ConsoleLog {
  type: 'info' | 'error' | 'success' | 'warning' | 'ai';
  message: string;
  timestamp: number;
}

export interface ExecutionResult {
  success: boolean;
  output: string[];
  error?: string;
  returnValue?: any;
  previewUrl?: string; // For HTML/Web previews
}

export interface FixSuggestion {
  fixedFiles: { name: string, content: string }[];
  explanation: string;
  errorAnalysis: string;
}

export interface SessionState {
  files: ProjectFile[];
  activeFileId: string;
  status: AppStatus;
  logs: ConsoleLog[];
  retryCount: number;
  maxRetries: number;
  lastFix?: FixSuggestion;
  theme: Theme;
}
