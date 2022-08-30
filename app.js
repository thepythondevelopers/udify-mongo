require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");


//Routes
const authRoutes = require("./authentication/routes/auth");
const adminUser = require("./admin/routes/admin/user");
const cmsPageRoutes = require("./cmsPage/routes/cms_pages");
const knowledgebaseRoutes = require("./knowledgebase/routes/knowledgebase");
const integrationRoutes = require("./integration/routes/integration");
const supportRoutes = require("./support/routes/support");
const getInTouchRoutes = require("./getInTouch/routes/get_in_touch");
//Connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
     useFindAndModify: false 
}).then(()=>{
    console.log('DATA CONNECTED');
}).catch((err)=>{
    console.log(err);
})

app.use(express.static('uploads/avatar')); 
app.use('/uploads/avatar', express.static('uploads/avatar'));
app.use(express.static('uploads/email')); 
app.use('/uploads/email', express.static('uploads/email'));
app.use(express.static('uploads/support')); 
app.use('/uploads/support', express.static('uploads/support'));

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/authentication-node',authRoutes);
app.use('/admin-node',adminUser);
app.use('/cms-node',cmsPageRoutes);
app.use('/knowledgebase-node',knowledgebaseRoutes);
app.use('/integration-node',integrationRoutes);
app.use('/support-node',supportRoutes);
app.use('/get-in-touch-node',getInTouchRoutes);
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});

