const LOCAL_DASHBOARD_URL = "http://localhost:3001";
const LOCAL_API_URL = "http://localhost:3002";
const PRODUCTION_DASHBOARD_URL = "https://stocky-dash-er2q87iya-aish1.vercel.app";
const PRODUCTION_API_URL = "https://stocky-backend-n4pe.onrender.com";

const isLocalhost = (hostname) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

const getRuntimeHostname = () => {
  if (typeof window === "undefined") {
    return "localhost";
  }

  return window.location.hostname;
};

export const getDashboardBaseUrl = () => {
  if (process.env.REACT_APP_DASHBOARD_URL) {
    return process.env.REACT_APP_DASHBOARD_URL.replace(/\/+$/, "");
  }

  const hostname = getRuntimeHostname();
  if (isLocalhost(hostname)) {
    return LOCAL_DASHBOARD_URL;
  }

  return PRODUCTION_DASHBOARD_URL;
};

export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  }

  const hostname = getRuntimeHostname();
  if (isLocalhost(hostname)) {
    return LOCAL_API_URL;
  }

  return PRODUCTION_API_URL;
};
