var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {saveChat,getChat,getUserList,getSupplierList} = require("../controllers/chat");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/save-chat",[
    check("send_to").notEmpty(),
    check("message").notEmpty()
],verifyToken,saveChat);

router.post("/get-chat/:user_id",verifyToken,getChat);

router.post("/get-user-list",verifyToken,getUserList);

router.post("/get-supplier-list",verifyToken,getSupplierList);




module.exports = router;
