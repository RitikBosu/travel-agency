// env-loader.js - Load .env.local variables for server-side code
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
  
  envFile.split('\n').forEach(line => {
    // Skip empty lines and comments
    if (!line || line.trim().startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Remove quotes if present
      const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
      process.env[key.trim()] = cleanValue;
    }
  });
  
  console.log('✓ Environment variables loaded from .env.local');
} catch (error) {
  console.warn('⚠ Could not load .env.local file:', error.message);
}
