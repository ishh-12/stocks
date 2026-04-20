const analysisService = require("../services/portfolio/analysisService");

const getPortfolioAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const analysis = await analysisService.getPortfolioAnalysis(userId);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to compute portfolio analysis.",
      error: error.message,
    });
  }
};

module.exports = {
  getPortfolioAnalysis,
};
