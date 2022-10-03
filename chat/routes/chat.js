var express = require('express')
var router = express.Router()
const { check} = require("express-validator");

const {saveChat,getChat} = require("../controllers/chat");

const {verifyToken,isAccountCheck,roleCheck} = require("../../middleware/auth");

router.post("/save-chat",[
    check("send_to").notEmpty(),
    check("message").notEmpty()
],verifyToken,saveChat);

router.post("/get-chat",verifyToken,getChat);




module.exports = router;
