const TTLCache = require("../cache/ttlCache");
const PortfolioService = require("./portfolioService");
const RiskService = require("./riskService");

class AnalysisService {
  constructor() {
    this.cacheTtlMs = 45000;
    this.cache = new TTLCache(this.cacheTtlMs);
    this.portfolioService = new PortfolioService();
    this.riskService = new RiskService();
  }

  getMethodology() {
    return {
      formulas: {
        sectorAllocationPercent:
          "(sector current value / total portfolio current value) * 100",
        hhi: "sum((stock weight)^2), where stock weight is stock percentage / 100",
        riskScore: "Base score + sum(rule impacts), then normalized to 0-100",
      },
      hhiBands: [
        { range: "0-0.15", interpretation: "Diversified" },
        { range: "0.15-0.25", interpretation: "Moderate concentration" },
        { range: ">0.25", interpretation: "High concentration" },
      ],
      scoreNormalization: "Risk score normalized between 0-100",
      recalculation: `Risk recalculated every ${Math.floor(
        this.cacheTtlMs / 1000
      )} seconds or on portfolio update`,
    };
  }

  buildInsights(snapshot, risk) {
    const insights = [];

    const topSector = snapshot.allocation.sectorWise[0];
    const topStock = snapshot.allocation.stockWise[0];

    if (topSector && topSector.percentage > 60) {
      insights.push(`Reduce exposure to the ${topSector.sector} sector to improve diversification.`);
    }

    if (topStock && topStock.percentage > 40) {
      insights.push("Rebalance your largest stock position to reduce single-stock dependency.");
    }

    if (snapshot.diversification.effectiveStocks < 4) {
      insights.push("Add more uncorrelated holdings to increase effective diversification.");
    }

    if (risk.category === "High") {
      insights.push("Overall portfolio risk is high. Consider rebalancing exposure.");
    }

    if (!insights.length) {
      insights.push("Portfolio diversification looks balanced based on current rules.");
    }

    return insights;
  }

  async getPortfolioAnalysis(userId) {
    const cacheKey = `portfolio-analysis:${userId}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return {
        ...cached,
        cache: {
          hit: true,
          ttlSeconds: Math.floor(this.cacheTtlMs / 1000),
          strategy: "TTL cache with explicit invalidation on holdings/order updates",
        },
      };
    }

    const snapshot = await this.portfolioService.getUserPortfolioSnapshot(userId);
    const risk = this.riskService.calculateRisk(snapshot);
    const insights = this.buildInsights(snapshot, risk);

    const result = {
      totals: snapshot.totals,
      allocation: snapshot.allocation,
      diversification: {
        ...snapshot.diversification,
        hhi: Number(snapshot.diversification.hhi.toFixed(4)),
        top3Weight: Number(snapshot.diversification.top3Weight.toFixed(2)),
        effectiveStocks: Number(snapshot.diversification.effectiveStocks.toFixed(2)),
      },
      risk,
      insights,
      methodology: this.getMethodology(),
      generatedAt: new Date().toISOString(),
    };

    this.cache.set(cacheKey, result);

    return {
      ...result,
      cache: {
        hit: false,
        ttlSeconds: Math.floor(this.cacheTtlMs / 1000),
        strategy: "TTL cache with explicit invalidation on holdings/order updates",
      },
    };
  }

  invalidateUser(userId) {
    const cacheKey = `portfolio-analysis:${userId}`;
    this.cache.delete(cacheKey);
  }
}

module.exports = new AnalysisService();
