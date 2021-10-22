const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roles = ['user', 'admin', 'rider']

const userSchema = new Schema({
  fname: {
    type: String,
  },
  sname: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: roles
  },
  phone: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
  },
  referredBy: {
    type: String,
  },
  referralCode: {
    type: String
  },
  token: {
    type: String
  },
  recentAddress: {
    type: Array,
  },
  clearedTip: {
    type: Number,
    default: 0
  },
  customerId: {
    type: String
  },
  last4: {
    type: String
  }
},  { timestamps: true });



module.exports = mongoose.model("User", userSchema);
