const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bg: {
    type: String,
  },
  icon: {
    type: String,
    required: true,
  },
  orderNumber: {
    type: Number,
    required: true,
  }
},  { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
 