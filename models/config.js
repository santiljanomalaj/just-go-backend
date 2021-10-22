const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const configSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['TIMING']
    },
  status: {
    type: Boolean,
    required: true,
  },
  statusTitle: {
    type: String,
    required: true,
  },
  statusSubTitle: {
    type: String,
  },
},  { timestamps: true });

module.exports = mongoose.model("Config", configSchema);
