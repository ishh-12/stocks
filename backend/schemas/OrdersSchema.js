const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  userId: {
    type: String,
    index: true,
  },
  name: String,
  qty: Number,
  price: Number,
  mode: String,
});

module.exports = { OrdersSchema };
