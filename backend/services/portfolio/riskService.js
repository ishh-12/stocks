class RiskService {
  getHHIInterpretation(hhi) {
    if (hhi <= 0.15) {
      return "Diversified portfolio";
    }

    if (hhi <= 0.25) {
      return "Moderately concentrated portfolio";
    }

    return "Highly concentrated portfolio";
  }

  calculateRisk(snapshot) {
    const stockWise = snapshot.allocation.stockWise;
    const sectorWise = snapshot.allocation.sectorWise;

    const maxStock = stockWise[0] || { symbol: "N/A", percentage: 0 };
    const maxSector = sectorWise[0] || { sector: "N/A", percentage: 0 };

    let score = 15;
    const factors = [];

    if (maxStock.percentage > 40) {
      const impact = Math.min(30, 10 + (maxStock.percentage - 40) * 1.2);
      score += impact;
      factors.push({
        rule: "single_stock_concentration",
        title: "High stock concentration (>40%)",
        impact: Number(impact.toFixed(2)),
        observation: `${maxStock.symbol} contributes ${maxStock.percentage.toFixed(2)}% of portfolio value`,
      });
    }

    if (maxSector.percentage > 60) {
      const impact = Math.min(25, 8 + (maxSector.percentage - 60) * 0.8);
      score += impact;
      factors.push({
        rule: "single_sector_concentration",
        title: "High sector concentration (>60%)",
        impact: Number(impact.toFixed(2)),
        observation: `${maxSector.sector} contributes ${maxSector.percentage.toFixed(2)}% of portfolio value`,
      });
    }

    const hhi = snapshot.diversification.hhi;
    const hhiInterpretation = this.getHHIInterpretation(hhi);
    if (hhi > 0.2) {
      const impact = Math.min(20, (hhi - 0.2) * 100);
      score += impact;
      factors.push({
        rule: "portfolio_concentration_hhi",
        title: "Portfolio concentration by HHI",
        impact: Number(impact.toFixed(2)),
        observation: `HHI = ${hhi.toFixed(2)} → ${hhiInterpretation}`,
      });
    }

    const top3Weight = snapshot.diversification.top3Weight;
    if (top3Weight > 70) {
      const impact = Math.min(15, (top3Weight - 70) * 0.6);
      score += impact;
      factors.push({
        rule: "top3_weight",
        title: "Top 3 holdings dependency (>70%)",
        impact: Number(impact.toFixed(2)),
        observation: `Top 3 stocks contribute ${top3Weight.toFixed(2)}% of portfolio value`,
      });
    }

    const holdingsCount = snapshot.totals.holdingsCount;
    if (holdingsCount < 5) {
      score += 10;
      factors.push({
        rule: "low_holdings_count",
        title: "Low diversification (holdings < 5)",
        impact: 10,
        observation: `Only ${holdingsCount} holdings are present`,
      });
    } else if (holdingsCount < 8) {
      score += 5;
      factors.push({
        rule: "moderate_holdings_count",
        title: "Low holdings count (<8)",
        impact: 5,
        observation: `Only ${holdingsCount} holdings are present`,
      });
    }

    const finalScore = Math.max(0, Math.min(100, Number(score.toFixed(2))));

    let category = "Low";
    let color = "#2e7d32";
    if (finalScore > 66) {
      category = "High";
      color = "#d32f2f";
    } else if (finalScore > 33) {
      category = "Medium";
      color = "#ed6c02";
    }

    return {
      score: finalScore,
      category,
      color,
      hhiInterpretation,
      factors,
    };
  }
}

module.exports = RiskService;
