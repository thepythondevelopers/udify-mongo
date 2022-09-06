var express = require('express')
var router = express.Router()
const { check} = require("express-validator");
const {getSingleProduct,getProductAccordingtoStore,syncProduct} = require("../controllers/product");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../../middleware/auth");


router.get("/get-single-shopify/:product_id",verifyToken,getSingleProduct);

router.get("/sync-product/:integration_id",verifyToken,syncProduct);

router.post("/get-all-product-store",verifyToken,isAccountCheck,checkStoreId,getProductAccordingtoStore);








module.exports = router;