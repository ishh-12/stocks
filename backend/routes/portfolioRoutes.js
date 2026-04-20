const express = require("express");
const { getPortfolioAnalysis } = require("../controllers/portfolioAnalysisController");

const router = express.Router();

router.get("/analysis", getPortfolioAnalysis);

module.exports = router;
