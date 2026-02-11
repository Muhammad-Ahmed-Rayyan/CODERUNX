
# 🚀 CODERUNX: THE ENTERPRISE AI DEBUGGER



**CODERUNX** is a cutting-edge, enterprise-grade AI-powered code debugger and execution environment. Built for developers who demand high productivity and zero downtime due to logical errors, CODERUNX leverages **Gemini 3 Pro** to perform autonomous self-correction loops on complex, multi-file software projects.

![CODERUNX Logo](favicon.svg)

---

## 🌟 CORE INNOVATIONS

### 🔍 Deep Neural Diagnostics
Beyond simple syntax checking, CODERUNX uses advanced reasoning models to understand the *intent* of your code. It scans your entire workspace to identify:
- **Architectural Logical Flaws**: Inconsistencies between different modules.
- **Runtime Vulnerabilities**: Potential crashes or edge cases in your logic.
- **Asynchronous Deadlocks**: Identifying race conditions in complex workflows.

### 🔄 Autonomous Self-Healing Cycle
The platform implements a "Repair-Verify-Deploy" loop:
1.  **Analyze**: Gemini Pro consumes the error stack trace and the entire project context.
2.  **Hypothesize**: The AI identifies the most likely cause of failure.
3.  **Patch**: A precision code modification is generated.
4.  **Simulate**: The new code is executed in an AI-powered sandbox.
5.  **Verify**: If the simulation succeeds, the fix is applied permanently.

### 🏗️ Advanced Multi-File Workspace
- **Directory Ingestion**: Drag and drop entire project folders directly into the browser.
- **Dynamic File Tree**: A robust navigator that mirrors your local development environment.
- **Contextual Awareness**: The AI understands dependencies across multiple files simultaneously.

### 🛡️ Polyglot AI Sandbox
Execute code in an isolated, secure environment without local setup.
- **Universal Runtime**: AI-simulated execution for Python, C++, JavaScript, TypeScript, and more.
- **Live Terminal**: A real-time, scrolling console with distinct AI diagnostic tags and system logs.

---

## 🛠️ TECHNICAL ARCHITECTURE

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Logic Engine**: [Google Gemini 3 Pro API](https://ai.google.dev/)
- **UI Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Code Highlighting**: [PrismJS](https://prismjs.com/) with custom high-contrast themes.
- **Project Packaging**: [JSZip](https://stuk.github.io/jszip/) for instantaneous archive generation.
- **Typography**: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (optimized for code readability).

---

## 🚀 GETTING STARTED

### Prerequisites
- A modern web browser (Chrome, Edge, or Firefox recommended).
- A valid **Gemini API Key** (managed via environment variables in production).

### Local Configuration
Ensure your environment is set up with:
```env
API_KEY=your_gemini_pro_api_key
```

### Application Structure
- `App.tsx`: Central state management and AI loop orchestration.
- `services/geminiService.ts`: Specialized API layer for high-thinking budget logic repairs.
- `components/CodeEditor.tsx`: Advanced scroll-synced editor with PrismJS integration.
- `components/FileTree.tsx`: Recursive tree component for multi-file navigation.

---

## 📖 WORKFLOW GUIDE

1.  **Project Initialization**: Launch the debugger and populate your workspace using the "Plus" or "Upload" buttons.
2.  **Define Context**: Use the "Environment Context" panel to provide the AI with specific goals or constraints (e.g., "Must run in a memory-constrained environment").
3.  **Initiate Analysis**: Trigger "ANALYZE & FIX". CODERUNX will begin its repair cycles.
4.  **Interactive Debugging**: Watch the "Mini Progress" panel to track the AI's current phase (Analysis -> Execution -> Repair -> Verification).
5.  **Audit Patches**: Review changes in the code editor (changes are highlighted for immediate feedback).
6.  **Deploy**: Export your stabilized project as a high-integrity ZIP archive.

---

## 🤝 CONTRIBUTIONS & ROADMAP

We are constantly evolving CODERUNX. Future enhancements include:
- **Git Integration**: Direct push/pull from GitHub/GitLab.
- **Real-time Collaboration**: Multi-user shared debugging sessions.
- **Extended Language Support**: Native runtimes for Rust and Go.

Feel free to open a PR or report issues on the [GitHub Repository](https://github.com/Muhammad-Ahmed-Rayyan/CoderunX).

---

## 📜 LEGAL & ATTRIBUTION
Built with precision and passion by [Muhammad Ahmed Rayyan](https://github.com/Muhammad-Ahmed-Rayyan).
© 2026 CODERUNX. All rights reserved. Licensed under the MIT License.
