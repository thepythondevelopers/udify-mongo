const Shopify = require('shopify-api-node');
const User = require("../../models/user");
const {validationResult} = require("express-validator");
var pluck = require('arr-pluck');
const UserVendorProduct = require("../../models/userVendorProduct");

exports.getUserVendor =  async (req,res) =>{
    
  supplier_id = await UserVendorProduct.find({user_id : req.user._id}).select('supplier_id');
  supplier_id = pluck(supplier_id, 'supplier_id');
  supplier = await User.find({_id: { $in: supplier_id }}).select('-password')
  return res.json(supplier);

  }    