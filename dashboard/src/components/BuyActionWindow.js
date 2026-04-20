import React, { useContext, useState } from "react";

import api from "../api";
import { getApiBaseUrl } from "../config/runtimeUrls";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const generalContext = useContext(GeneralContext);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleBuyClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
      setError("Enter valid quantity and price.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await api.post("/newOrder", {
        name: uid,
        qty,
        price,
        mode: "BUY",
      });

      window.dispatchEvent(new Event("holdings:refresh"));
      generalContext.closeBuyWindow();
    } catch (err) {
      if (!err.response) {
        setError(
          `Backend not reachable at ${getApiBaseUrl()}. Please try again in a few seconds.`
        );
        return;
      }
      setError(err.response?.data?.message || "Buy failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required Rs 140.65</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick} disabled={isSubmitting}>
            {isSubmitting ? "Buying..." : "Buy"}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </div>
      {error && (
        <p style={{ color: "#d9534f", marginTop: "8px", fontSize: "12px" }}>{error}</p>
      )}
    </div>
  );
};

export default BuyActionWindow;
