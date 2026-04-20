const LOCAL_DASHBOARD_URL = "http://localhost:3001";
const LOCAL_API_URL = "http://localhost:3002";
const PRODUCTION_DASHBOARD_URL = "https://ishh-12-stocks-dash.vercel.app";
const PRODUCTION_API_URL = "https://stocky-backend-n4pe.onrender.com";

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

export const getDashboardBaseUrl = () => {
  if (process.env.REACT_APP_DASHBOARD_URL) {
    const configuredDashboardUrl = process.env.REACT_APP_DASHBOARD_URL.replace(/\/+$/, "");
    if (typeof window !== "undefined" && !isLocalhost(window.location.hostname) && isLocalUrl(configuredDashboardUrl)) {
      return PRODUCTION_DASHBOARD_URL;
    }
    return configuredDashboardUrl;
  }

  const hostname = getRuntimeHostname();
  if (isLocalhost(hostname)) {
    return LOCAL_DASHBOARD_URL;
  }

  return PRODUCTION_DASHBOARD_URL;
};

export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    const configuredApiUrl = process.env.REACT_APP_API_URL.replace(/\/+$/, "");
    if (typeof window !== "undefined" && !isLocalhost(window.location.hostname) && isLocalUrl(configuredApiUrl)) {
      return PRODUCTION_API_URL;
    }
    return configuredApiUrl;
  }

  const hostname = getRuntimeHostname();
  if (isLocalhost(hostname)) {
    return LOCAL_API_URL;
  }

  return PRODUCTION_API_URL;
};
