const { Schema } = require("mongoose");

const TransactionsSchema = new Schema({
  userId: {
    type: String,
    index: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["add", "withdraw", "buy", "sell"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { TransactionsSchema };
