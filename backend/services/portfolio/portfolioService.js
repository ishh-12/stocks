const { HoldingsModel } = require("../../model/HoldingsModel");
const { getSectorForSymbol } = require("./sectorMap");

class PortfolioService {
  async getUserPortfolioSnapshot(userId) {
    const holdings = await HoldingsModel.find({ userId })
      .select("name qty avg price")
      .lean();

    const normalizedHoldings = holdings
      .map((holding) => {
        const qty = Number(holding.qty) || 0;
        const avg = Number(holding.avg) || 0;
        const price = Number(holding.price) || 0;
        const symbol = String(holding.name || "").trim().toUpperCase();

        return {
          symbol,
          qty,
          avg,
          price,
          investmentValue: qty * avg,
          currentValue: qty * price,
          sector: getSectorForSymbol(symbol),
        };
      })
      .filter((holding) => holding.symbol && holding.qty > 0);

    const totals = normalizedHoldings.reduce(
      (acc, holding) => {
        acc.investment += holding.investmentValue;
        acc.currentValue += holding.currentValue;
        return acc;
      },
      { investment: 0, currentValue: 0 }
    );

    totals.pnl = totals.currentValue - totals.investment;
    totals.pnlPercent = totals.investment > 0 ? (totals.pnl / totals.investment) * 100 : 0;
    totals.holdingsCount = normalizedHoldings.length;

    const stockWise = normalizedHoldings
      .map((holding) => ({
        symbol: holding.symbol,
        sector: holding.sector,
        qty: holding.qty,
        avg: holding.avg,
        price: holding.price,
        investmentValue: holding.investmentValue,
        currentValue: holding.currentValue,
        pnl: holding.currentValue - holding.investmentValue,
        percentage:
          totals.currentValue > 0 ? (holding.currentValue / totals.currentValue) * 100 : 0,
      }))
      .sort((a, b) => b.currentValue - a.currentValue);

    const sectorMap = stockWise.reduce((acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = { value: 0 };
      }
      acc[stock.sector].value += stock.currentValue;
      return acc;
    }, {});

    const sectorWise = Object.entries(sectorMap)
      .map(([sector, item]) => ({
        sector,
        value: item.value,
        percentage: totals.currentValue > 0 ? (item.value / totals.currentValue) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const hhi = stockWise.reduce((sum, stock) => {
      const weight = stock.percentage / 100;
      return sum + weight * weight;
    }, 0);

    const top3Weight = stockWise
      .slice(0, 3)
      .reduce((sum, stock) => sum + stock.percentage, 0);

    return {
      totals,
      allocation: {
        stockWise,
        sectorWise,
      },
      diversification: {
        hhi,
        top3Weight,
        effectiveStocks: hhi > 0 ? 1 / hhi : 0,
      },
    };
  }
}

module.exports = PortfolioService;
