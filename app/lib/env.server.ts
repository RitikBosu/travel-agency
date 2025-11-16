// Server-side environment variables helper
// In React Router v7, process.env is available in server-side code

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Export typed and validated environment variables
export const env = {
  get GEMINI_API_KEY() {
    return getEnvVar('GEMINI_API_KEY');
  },
  get UNSPLASH_ACCESS_KEY() {
    return getEnvVar('UNSPLASH_ACCESS_KEY');
  },
  get STRIPE_SECRET_KEY() {
    return getEnvVar('STRIPE_SECRET_KEY');
  },
  get VITE_BASE_URL() {
    return getEnvVar('VITE_BASE_URL');
  },
} as const;
