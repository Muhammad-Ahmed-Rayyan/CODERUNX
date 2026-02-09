
import { ExecutionResult } from '../types';

export const runInSandbox = async (code: string): Promise<ExecutionResult> => {
  const logs: string[] = [];
  
  // Custom console proxy
  const customConsole = {
    log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')),
    error: (...args: any[]) => logs.push(`Error: ${args.map(a => String(a)).join(' ')}`),
    warn: (...args: any[]) => logs.push(`Warning: ${args.map(a => String(a)).join(' ')}`),
    info: (...args: any[]) => logs.push(`Info: ${args.map(a => String(a)).join(' ')}`),
  };

  try {
    // Create a new function from the code
    // We wrap it in an async IIFE to support await
    const wrappedCode = `
      const console = arguments[0];
      return (async () => {
        ${code}
      })();
    `;

    const execute = new Function(wrappedCode);
    const result = await execute(customConsole);

    return {
      success: true,
      output: logs,
      returnValue: result
    };
  } catch (err: any) {
    return {
      success: false,
      output: logs,
      error: err.message || String(err)
    };
  }
};
