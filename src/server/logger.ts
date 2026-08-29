import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logError = (error: Error | any, context?: string) => {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.stack || error.message : JSON.stringify(error);
  const logMessage = `[${timestamp}] ${context ? `[${context}] ` : ''}${errorMessage}\n\n`;
  
  // Log to console as well
  console.error(logMessage);
  
  try {
    fs.appendFileSync(path.join(logsDir, 'error.log'), logMessage);
  } catch (err) {
    console.error('Failed to write to error log file:', err);
  }
};
