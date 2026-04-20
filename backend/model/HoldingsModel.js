// Schema — defines the SHAPE of data
const { model } = require("mongoose");

// Model — uses that schema to CREATE a DB interface
const { HoldingsSchema } = require("../schemas/HoldingsSchema");

const HoldingsModel = new model("holding", HoldingsSchema);

module.exports = { HoldingsModel };
