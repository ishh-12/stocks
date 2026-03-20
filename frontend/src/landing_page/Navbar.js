import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(!!token && auth === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <nav
      class="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div class="container p-2">
        <Link class="navbar-brand" to="/">
          <img
            src={`${process.env.PUBLIC_URL}/media/images/logo.svg`}
            style={{ width: "25%" }}
            alt="Logo"
          />
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <form class="d-flex" role="search">
            <ul class="navbar-nav mb-lg-0">
              {!isAuthenticated && (
                <>
                  <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to="/login">
                      Login
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to="/signup">
                      Signup
                    </Link>
                  </li>
                </>
              )}
              <li class="nav-item">
                <Link class="nav-link active" to="/about">
                  About
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/product">
                  Products
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/pricing">
                  Pricing
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link active" to="/support">
                  Support
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      href="http://localhost:3001"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li class="nav-item">
                    <button
                      class="nav-link active btn btn-link"
                      onClick={handleLogout}
                      style={{ cursor: "pointer", border: "none", background: "none" }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
