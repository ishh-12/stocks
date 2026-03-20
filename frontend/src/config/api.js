const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3002";

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;
