const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;
const integrationSchema = new Schema({
      store_api_key: {
        type: String,
        required : true,
      },
      store_api_secret: {
        type: String,
        required: true,
      },
      domain:{
        type: String,
        required : true,
      },
      access_token:{
        type: String,
        required : true,
      },
      store_id:{
        type: String,
        required : true,
      }, 
    account_id: {
      type : ObjectId,
      ref: "Account"
    }  
    },{timestamps: true});

module.exports = mongoose.model("Integration",integrationSchema);