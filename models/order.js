const mongoose = require("mongoose");

const Schema = mongoose.Schema;
 
const orderSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  deliveredAt:  {
    type: Date,
  },
  orderedAt:  {
    type: Date,
    required: true
  },
   location:  {
    type: Object,
    required: true
  },
  delivery:  {
    type: String,
    default: 'FREE'
  },
  name: {
    type: String,
    required: true,
  },
  notes:  {
    type: String,
  },
  phone:  {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['UNPAID', 'PENDING', 'CONFIRMED', 'PACKED', 'ONWAY', 'DELIVERED']
  },
  subtotal:  {
    type: Number,
    required: true
  },
  total:  {
    type: Number,
    required: true
  },
  tax:  {
    type: Number,
  },
  discount:  {
    type: Number,
    default: 0
  },
  uid: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  tip: {
    type: Number
  },
  products: {
    type: Array,
    required: true
  },
  riderId: {
    type: String
  },
  index: {
    type: Number,
  }
},  { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
  