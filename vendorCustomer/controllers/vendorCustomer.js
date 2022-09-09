const Shopify = require('shopify-api-node');
const User = require("../../models/user");
const {validationResult} = require("express-validator");
var pluck = require('arr-pluck');
const UserVendorProduct = require("../../models/userVendorProduct");

exports.getVendorCustomer =  async (req,res) =>{
    
  user_id = await UserVendorProduct.find({supplier_id : req.user._id}).select('user_id');
  user_id = pluck(user_id, 'user_id');
  user = await User.find({_id: { $in: user_id }}).select('-password')
  return res.json(user);

  }    