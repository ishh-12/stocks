const LOCAL_API_URL = "http://localhost:3002";
const LOCAL_FRONTEND_URL = "http://localhost:3000";
const PRODUCTION_API_URL = "https://stocky-backend-n4pe.onrender.com";
const PRODUCTION_FRONTEND_URL = "https://ishh-12-stocks-frontend-six.vercel.app";

const isLocalhost = (hostname) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const isLocalUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const normalized = value.startsWith("http") ? value : `http://${value}`;
    const parsed = new URL(normalized);
    return isLocalhost(parsed.hostname);
  } catch {
    return false;
  }
};

const getRuntimeHostname = () => {
  if (typeof window === "undefined") {
    return "localhost";
  }

  return window.location.hostname;
};

export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    const configuredApiUrl = process.env.REACT_APP_API_URL.replace(/\/+$/, "");
    if (typeof window !== "undefined" && !isLocalhost(window.location.hostname) && isLocalUrl(configuredApiUrl)) {
      return PRODUCTION_API_URL;
    }
    return configuredApiUrl;
  }

  if (typeof window === "undefined") {
    return LOCAL_API_URL;
  }

  if (isLocalhost(window.location.hostname)) {
    return LOCAL_API_URL;
  }

  return PRODUCTION_API_URL;
};

export const getFrontendBaseUrl = () => {
  if (process.env.REACT_APP_FRONTEND_URL) {
    return process.env.REACT_APP_FRONTEND_URL.replace(/\/+$/, "");
  }

  const hostname = getRuntimeHostname();
  if (isLocalhost(hostname)) {
    return LOCAL_FRONTEND_URL;
  }

  return PRODUCTION_FRONTEND_URL;
};
