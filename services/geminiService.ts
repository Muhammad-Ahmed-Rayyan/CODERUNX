import { GoogleGenAI, Type } from "@google/genai";
import { ProjectFile, FixSuggestion, ExecutionResult } from "../types";

// Initialize with the standard environment variable provided by the platform
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to analyze a project and provide a multi-file fix.
 * Uses high thinking budget to solve architectural bugs.
 */
export const getProjectFix = async (
  files: ProjectFile[], 
  error: string, 
  userContext?: string
): Promise<FixSuggestion> => {
  // Use full path for context to ensure AI understands directory structure
  const projectContext = files.map(f => {
    const fullPath = (f.path || '') + f.name;
    return `FILE_PATH: ${fullPath}\nLANGUAGE: ${f.language}\nCONTENT:\n${f.content}`;
  }).join('\n\n---\n\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `The following project failed with an execution error. Please analyze the entire project context, find the bug, and provide the corrected files.
    
ERROR ENCOUNTERED:
${error}

${userContext ? `USER PROVIDED CONTEXT/HINT:\n${userContext}\n` : ''}

PROJECT CONTEXT:
${projectContext}`,
    config: {
      systemInstruction: `You are a world-class senior software architect. 
Analyze multi-file projects to find and fix bugs. 

IMPORTANT RULES:
1. Use the EXACT "FILE_PATH" provided in the context for the "name" field in your response for existing files.
2. Return the FULL content of each file you modify. Do not return snippets.
3. If a new file is required to fix the bug, you may include it in the "fixedFiles" array with a descriptive path-based "name".
4. Provide a deep analysis of why the error occurred and how your fix resolves it.

Return a JSON object matching the provided schema.`,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fixedFiles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The full path of the file as provided in FILE_PATH" },
                content: { type: Type.STRING, description: "The complete corrected source code" }
              },
              required: ["name", "content"]
            }
          },
          explanation: { type: Type.STRING, description: "Brief summary of the fix" },
          errorAnalysis: { type: Type.STRING, description: "Detailed root cause analysis" }
        },
        required: ["fixedFiles", "explanation", "errorAnalysis"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini API");
  }
  return JSON.parse(response.text.trim());
};

/**
 * Simulates the execution of any code (Python, C++, C#, etc.) using AI.
 */
export const simulateExecution = async (files: ProjectFile[]): Promise<ExecutionResult> => {
  const projectContext = files.map(f => `PATH: ${(f.path || '') + f.name}\nCONTENT:\n${f.content}`).join('\n\n---\n\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Simulate the execution of this multi-file project. 
Consider all dependencies between files. 
Describe the output exactly as it would appear in a standard terminal. 
If there is a runtime bug, return success: false and provide the error message.
    
PROJECT FILES:
${projectContext}`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          success: { type: Type.BOOLEAN },
          output: { type: Type.ARRAY, items: { type: Type.STRING } },
          error: { type: Type.STRING, description: "Detailed error message if execution fails" }
        },
        required: ["success", "output"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini API");
  }
  return JSON.parse(response.text.trim());
};