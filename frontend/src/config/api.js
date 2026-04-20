import { getApiBaseUrl } from "./runtimeUrls";

const API_BASE_URL = getApiBaseUrl();

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
// Why this setup?

// API_BASE_URL points to your backend server
// buildApiUrl("/api/auth/login") creates full URLs like http://localhost:3002/api/auth/login
// Environment variables allow different URLs for development/production
