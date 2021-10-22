const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const smsSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
},  { timestamps: true });

module.exports = mongoose.model("Sms", smsSchema);
