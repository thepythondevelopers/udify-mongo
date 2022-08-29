require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");


//Routes
const authRoutes = require("./authentication/routes/auth");

const cmsPageRoutes = require("./cmsPage/routes/cms_pages");
const knowledgebaseRoutes = require("./knowledgebase/routes/knowledgebase");
const integrationRoutes = require("./integration/routes/integration");

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

app.use(express.static('uploads')); 
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/authentication-node',authRoutes);

app.use('/cms-node',cmsPageRoutes);
app.use('/knowledgebase-node',knowledgebaseRoutes);
app.use('/integration-node',integrationRoutes);

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});

