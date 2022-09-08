var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getUserVendor} = require("../controllers/userVendor");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/get-user-vendor",verifyToken,getUserVendor);




module.exports = router;
