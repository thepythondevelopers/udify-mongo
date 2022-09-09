var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getVendorCustomer} = require("../controllers/vendorCustomer");

const {verifyToken,supplierRoleCheck} = require("../../middleware/auth");

router.post("/get-customer",verifyToken,supplierRoleCheck,getVendorCustomer);




module.exports = router;
