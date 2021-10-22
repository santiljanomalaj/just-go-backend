const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
},  { timestamps: true });

module.exports = mongoose.model("Auth", authSchema);
