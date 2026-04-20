import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { DoughnutChart } from "./DoughnoutChart";
import { getApiBaseUrl } from "../config/runtimeUrls";

const Summary = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get("/api/portfolio/analysis");
        setAnalysis(res.data?.data || null);
        setError("");
      } catch (err) {
        if (!err.response) {
          setError(
            `Backend not reachable at ${getApiBaseUrl()}. Please try again in a few seconds.`
          );
        } else if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load portfolio analysis. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();

    const refreshHandler = () => {
      fetchAnalysis();
    };
    window.addEventListener("holdings:refresh", refreshHandler);

    return () => {
      window.removeEventListener("holdings:refresh", refreshHandler);
    };
  }, []);

  const sectorChartData = useMemo(() => {
    const sectorWise = analysis?.allocation?.sectorWise || [];
    return {
      labels: sectorWise.map((item) => item.sector),
      datasets: [
        {
          label: "Sector Allocation",
          data: sectorWise.map((item) => Number(item.percentage.toFixed(2))),
          backgroundColor: [
            "#1e88e5",
            "#00897b",
            "#f4511e",
            "#5e35b1",
            "#fb8c00",
            "#6d4c41",
            "#43a047",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [analysis]);

  if (loading) {
    return <h3 className="title">Loading portfolio analysis...</h3>;
  }

  if (error) {
    return (
      <p className="title" style={{ color: "#d9534f" }}>
        {error}
      </p>
    );
  }

  if (!analysis) {
    return <h3 className="title">No portfolio data available.</h3>;
  }

  const { totals, allocation, risk, insights, cache, methodology } = analysis;

  const pnlClass = totals.pnl >= 0 ? "positive" : "negative";

  return (
    <div className="analysis-layout">
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="analysis-top-grid">
        <div className="analysis-card">
          <p className="analysis-label">Portfolio Value</p>
          <h2>{totals.currentValue.toFixed(2)}</h2>
          <p className="analysis-meta">
            Investment: <span>{totals.investment.toFixed(2)}</span>
          </p>
        </div>

        <div className="analysis-card">
          <p className="analysis-label">Profit / Loss</p>
          <h2 className={pnlClass}>{totals.pnl.toFixed(2)}</h2>
          <p className={`analysis-meta ${pnlClass}`}>{totals.pnlPercent.toFixed(2)}%</p>
        </div>

        <div className="analysis-card">
          <p className="analysis-label">Holdings</p>
          <h2>{totals.holdingsCount}</h2>
          <p className="analysis-meta">
            Cache: <span>{cache?.hit ? "HIT" : "MISS"}</span>
          </p>
          <p className="analysis-subtext">
            TTL: {cache?.ttlSeconds || 0}s{cache?.strategy ? ` (${cache.strategy})` : ""}
          </p>
          <p className="analysis-subtext">
            {methodology?.recalculation || "Risk recalculated on updates."}
          </p>
          <p className="analysis-subtext">
            Portfolio analysis is cached to reduce redundant computations and improve response time.
          </p>
        </div>
      </div>

      <div className="analysis-main-grid">
        <div className="analysis-card">
          <div className="analysis-card-head">
            <h4>Sector Distribution</h4>
          </div>
          <div className="analysis-chart-wrap">
            <DoughnutChart data={sectorChartData} />
          </div>
          <div className="allocation-list">
            {allocation.sectorWise.map((item) => (
              <p key={item.sector}>
                {item.sector} <span>{item.percentage.toFixed(2)}%</span>
              </p>
            ))}
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-head">
            <h4>Risk Score</h4>
            <span className="risk-pill" style={{ backgroundColor: risk.color }}>
              {risk.category}
            </span>
          </div>
          <h2 style={{ color: risk.color }}>{risk.score.toFixed(2)} / 100</h2>
          <p className="analysis-subtext">Risk score normalized between 0-100</p>
          <div className="risk-bar-track">
            <div
              className="risk-bar-fill"
              style={{ width: `${risk.score}%`, backgroundColor: risk.color }}
            />
          </div>
          <div className="allocation-list">
            {(risk.factors || []).map((factor) => (
              <div key={factor.rule} className="risk-factor-item">
                <p>
                  {factor.title} <span>{`→ +${factor.impact.toFixed(2)}`}</span>
                </p>
                <small>{factor.observation}</small>
              </div>
            ))}
            {!risk.factors?.length && (
              <p>
                No concentration alerts <span>Stable</span>
              </p>
            )}
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-card-head">
            <h4>Insights</h4>
          </div>
          <ul className="insight-list">
            {insights.map((item, idx) => (
              <li key={`${item}-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="analysis-card">
        <div className="analysis-card-head">
          <h4>Top Stock Allocation</h4>
        </div>
        <div className="allocation-list">
          {allocation.stockWise.slice(0, 5).map((stock) => (
            <p key={stock.symbol}>
              {stock.symbol} <span>{stock.percentage.toFixed(2)}%</span>
            </p>
          ))}
        </div>
      </div>

      <div className="analysis-card">
        <div className="analysis-card-head">
          <h4>Concentration Methodology</h4>
        </div>
        <div className="analysis-subsection">
          <p className="analysis-subtext">
            HHI = {analysis.diversification.hhi.toFixed(2)} → {risk.hhiInterpretation}
          </p>
          <p className="analysis-subtext">0-0.15 → diversified</p>
          <p className="analysis-subtext">0.15-0.25 → moderate</p>
          <p className="analysis-subtext">>0.25 → high concentration</p>
          <p className="analysis-subtext">
            Risk scoring is deterministic and reproducible based on defined rules.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
