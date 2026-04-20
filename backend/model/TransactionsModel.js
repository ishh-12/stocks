const { model } = require("mongoose");

const { TransactionsSchema } = require("../schemas/TransactionsSchema");

const TransactionsModel = new model("transaction", TransactionsSchema);

module.exports = { TransactionsModel };
