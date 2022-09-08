var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {getSuppliersCatalog,addProduct} = require("../controllers/catalog");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/get-supplier-catalog",verifyToken,getSuppliersCatalog);
router.post("/add-product-catalog-shopify/:id/:store_id",verifyToken,addProduct);



module.exports = router;
