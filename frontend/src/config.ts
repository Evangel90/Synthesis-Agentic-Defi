/**
 * API Configuration
 * 
 * To switch between local and deployed servers:
 * 1. For local development, use: http://localhost:3000
 * 2. For production, use your deployed backend URL.
 * 
 * You can also use environment variables in a .env file:
 * VITE_API_BASE_URL=http://localhost:3000
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
