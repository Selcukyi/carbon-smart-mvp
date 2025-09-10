// Environment-based configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Backend URL configuration
export const BACKEND_URL = isDevelopment 
  ? 'http://localhost:8000'  // Development
  : import.meta.env.VITE_BACKEND_URL || 'https://your-backend-url.railway.app';  // Production

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_LLM_INSIGHTS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_AI_EXPLANATIONS: true,
  ENABLE_DARK_MODE: true,
  MOCK: true, // Enable mock data for development
};

// API endpoints
export const API_ENDPOINTS = {
  LLM_INSIGHTS: '/api/llm/insights',
  UPLOAD: '/api/upload',
  ENTITIES: '/api/entities',
  ALLOWANCES: '/api/allowances',
  EMISSIONS: '/api/emissions',
  FACTORS: '/api/factors',
  HEALTH: '/api/health',
};

// App configuration
export const APP_CONFIG = {
  NAME: 'CarbonSmart MVP',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered carbon emission management platform',
  SUPPORT_EMAIL: 'support@carbonmvp.com',
};