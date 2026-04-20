import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import Login from "./landing_page/login/Login";
import AboutPage from "./landing_page/about/AboutPage";
import ProductPage from "./landing_page/products/ProductsPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";

import NotFound from "./landing_page/NotFound";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";

const getDashboardBaseUrl = () => {
  if (process.env.REACT_APP_DASHBOARD_URL) {
    return process.env.REACT_APP_DASHBOARD_URL.replace(/\/+$/, "");
  }

  if (typeof window === "undefined") {
    return "http://localhost:3001";
  }

  const protocol = window.location.protocol;
  const host = window.location.hostname;
  const dashboardPort = process.env.REACT_APP_DASHBOARD_PORT || "3001";

  return `${protocol}//${host}:${dashboardPort}`;
};

// Redirect component to external dashboard with token 
const RedirectToDashboard = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  
  if (token && isAuthenticated === "true") {
    // Token exists and is authenticated, pass it to dashboard on the same host.
    const dashboardBaseUrl = getDashboardBaseUrl();
    window.location.href = `${dashboardBaseUrl}?token=${encodeURIComponent(token)}`;
  } else {
    // Not authenticated, return to this app's login route.
    window.location.href = `${window.location.origin}/login`;
  }
  return null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/dashboard" element={<RedirectToDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
