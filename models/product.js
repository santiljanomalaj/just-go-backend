const mongoose = require("mongoose");

const Schema = mongoose.Schema;
 
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
  },
  section:  {
    type: String,
  },
  details:  {
    type: String,
  },
  img: {
    type: String,
    required: true,
  },
  price:  {
    type: Number,
    required: true,
  },
  salePrice:  {
    type: Number,
  },
  categories: {
    type: Array,
    required: true
  },
  index: {
    type: Number,
  }
},  { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
 