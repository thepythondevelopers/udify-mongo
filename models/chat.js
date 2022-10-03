const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;            
const chatschema = new Schema({            
  send_by: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  send_to: {
    type : ObjectId,
    ref: "User",
    required : true
  },
  message:{
    type: String,
    required : true
  }
},{timestamps: true});

module.exports = mongoose.model("Chat",chatschema);