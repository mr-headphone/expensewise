// Simple tool to print colored messages in the terminal
export const logger = {
  info:    (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warn:    (msg) => console.warn(`⚠️  ${msg}`),
  error:   (msg) => console.error(`❌ ${msg}`),
};