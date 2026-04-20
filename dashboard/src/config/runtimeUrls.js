const LOCAL_API_URL = "http://localhost:3002";
const PRODUCTION_API_URL = "https://stocky-backend-n4pe.onrender.com";

const isLocalhost = (hostname) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  }

  if (typeof window === "undefined") {
    return LOCAL_API_URL;
  }

  if (isLocalhost(window.location.hostname)) {
    return LOCAL_API_URL;
  }

  return PRODUCTION_API_URL;
};
