import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { getFrontendBaseUrl } from "../config/runtimeUrls";

const Funds = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const frontendSignupUrl = useMemo(
    () => `${getFrontendBaseUrl()}/signup`,
    []
  );

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/funds/summary");
      setBalance(Number(res.data?.data?.balance) || 0);
      setTransactions(Array.isArray(res.data?.data?.transactions) ? res.data.data.transactions : []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load funds data. Please refresh and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAction = async (type) => {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setStatus("");

      const endpoint = type === "add" ? "/add-funds" : "/withdraw";
      const response = await api.post(endpoint, { amount: parsedAmount });

      setBalance(Number(response.data?.data?.balance) || 0);
      setStatus(response.data?.message || (type === "add" ? "Funds added." : "Funds withdrawn."));
      setAmount("");
      await fetchFunds();
      window.dispatchEvent(new Event("holdings:refresh"));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to complete fund request.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (value) => Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <div className="funds funds-toolbar">
        <p>Manage your account balance with instant add/withdraw actions.</p>
        <div className="funds-actions">
          <input
            type="number"
            min="1"
            step="0.01"
            className="funds-input"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-green" onClick={() => handleAction("add")} disabled={submitting}>
            {submitting ? "Processing..." : "Add funds"}
          </button>
          <button className="btn btn-blue" onClick={() => handleAction("withdraw")} disabled={submitting}>
            {submitting ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>

      {error && <p className="funds-message funds-error">{error}</p>}
      {status && <p className="funds-message funds-success">{status}</p>}

      <div className="funds-summary-card">
        <p className="funds-summary-label">Available balance</p>
        <h2>Rs {formatAmount(balance)}</h2>
        <p className="funds-summary-subtext">
          Live balance updates after add or withdraw actions.
        </p>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">Rs {formatAmount(balance)}</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">Rs 0.00</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">Rs {formatAmount(balance)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>Rs {formatAmount(transactions[transactions.length - 1]?.balanceAfter || balance)}</p>
            </div>
            <div className="data">
              <p>Net balance change</p>
              <p>{transactions.length ? `${transactions[0].type === "add" ? "+" : "-"}Rs ${formatAmount(transactions[0].amount)}` : "Rs 0.00"}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>{transactions.filter((item) => item.type === "add").length}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <a className="btn btn-blue" href={frontendSignupUrl} target="_blank" rel="noreferrer">
              Open Account
            </a>
          </div>
        </div>
      </div>

      <div className="funds-history-card">
        <h4>Transaction history</h4>
        {loading ? (
          <p className="funds-summary-subtext">Loading transactions...</p>
        ) : transactions.length ? (
          <div className="funds-history-list">
            {transactions.map((item) => (
              <div className="funds-history-row" key={item._id || `${item.type}-${item.timestamp}`}>
                <div>
                  <strong>{item.type === "add" ? "Added" : "Withdrawn"}</strong>
                  <p>{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div className={item.type === "add" ? "funds-positive" : "funds-negative"}>
                  {item.type === "add" ? "+" : "-"}Rs {formatAmount(item.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="funds-summary-subtext">No transactions yet.</p>
        )}
      </div>
    </>
  );
};

export default Funds;
