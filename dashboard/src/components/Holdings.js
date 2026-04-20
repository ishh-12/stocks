import React, { useState, useEffect } from "react";
import api from "../api";
import { VerticalGraph } from "./VerticalGraph";
import { getApiBaseUrl } from "../config/runtimeUrls";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await api.get("/allHoldings");
        setAllHoldings(Array.isArray(res.data) ? res.data : []);
        setError("");
      } catch (err) {
        setAllHoldings([]);
        if (!err.response) {
          setError(
            `Backend not reachable at ${getApiBaseUrl()}. Please try again in a few seconds.`
          );
          return;
        }
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          return;
        }
        setError(
          err.response?.data?.message ||
            "Cannot load holdings. Please check the backend connection."
        );
      }
    };

    fetchHoldings();

    const refreshHandler = () => {
      fetchHoldings();
    };
    window.addEventListener("holdings:refresh", refreshHandler);

    return () => {
      window.removeEventListener("holdings:refresh", refreshHandler);
    };
  }, []);

  const labels = allHoldings.map((subArray) => subArray["name"]);
  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const pnl = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // export const data = {
  //   labels,
  //   datasets: [
  // {
  //   label: 'Dataset 1',
  //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
  // },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      {error && (
        <p className="title" style={{ color: "#d9534f" }}>
          {error}
        </p>
      )}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>

            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const stockPnl = curValue - stock.avg * stock.qty;
              const isProfit = stockPnl >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{stockPnl.toFixed(2)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>
            {pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
