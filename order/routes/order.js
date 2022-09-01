var express = require('express')
var router = express.Router()
const { check} = require("express-validator");


const {getOrderAccordingtoStore,getSingleOrder,syncOrder} = require("../controllers/order");
const {verifyToken,isAccountCheck,roleCheck,checkStoreId} = require("../../middleware/auth");




router.post("/get-all-order-store",verifyToken,isAccountCheck,checkStoreId,getOrderAccordingtoStore);
router.get("/get-single-order/:order_id",verifyToken,getSingleOrder);
router.get("/sync-order/:integration_id",verifyToken,syncOrder);

module.exports = router;
