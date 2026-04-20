const STOCK_TO_SECTOR = {
  BHARTIARTL: "Telecom",
  HDFCBANK: "Financials",
  HINDUNILVR: "FMCG",
  INFY: "Technology",
  ITC: "FMCG",
  KPITTECH: "Technology",
  "M&M": "Automobile",
  RELIANCE: "Energy",
  SBIN: "Financials",
  SGBMAY29: "Commodities",
  TATAPOWER: "Utilities",
  TCS: "Technology",
  WIPRO: "Technology",
};

const getSectorForSymbol = (symbol) => {
  return STOCK_TO_SECTOR[symbol] || "Others";
};

module.exports = {
  getSectorForSymbol,
};
