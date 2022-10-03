require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");


//Routes
const authRoutes = require("./authentication/routes/auth");
const adminUser = require("./admin/routes/user");
const stripeRoutes = require("./stripe/routes/stripe");
const cmsPageRoutes = require("./cmsPage/routes/cms_pages");
const knowledgebaseRoutes = require("./knowledgebase/routes/knowledgebase");
const integrationRoutes = require("./integration/routes/integration");
const chatRoutes = require("./chat/routes/chat");
const supportRoutes = require("./support/routes/support");
const getInTouchRoutes = require("./getInTouch/routes/get_in_touch");
const planRoutes = require("./plan/routes/plan");
const OrderShopifyRoutes = require("./order/routes/order");
const customerRoutes = require("./customers/routes/customer");
const profileRoutes = require("./profile/routes/profile");
const productRoutes = require("./product/routes/product");
const productVariationRoutes = require("./product/routes/productVariation");
const vendorProductRoutes = require("./vendorProduct/routes/product");
const catalogRoutes = require("./catalog/routes/catalog");
const userCatalogRoutes = require("./userCatalog/routes/catalog");
const userVendorRoutes = require("./userVendor/routes/userVendor");
const vendorCustomerRoutes = require("./vendorCustomer/routes/vendorCustomer");
const vendorOrderRoutes = require("./vendorOrder/routes/order");

const pubSubCustomerRoutes = require("./pub-sub-customers/routes/customer");
const pubSubOrderRoutes = require("./pub-sub-orders/routes/order");
const pubSubProductRoutes = require("./pub-sub-products/routes/product");
const pubSubVendorProductRoutes = require("./pub-sub-vendor-products/routes/product");
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

app.use(bodyParser.json({
    limit: '50mb'
  }));
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/authentication-node',authRoutes);
app.use('/admin-node',adminUser);
app.use('/cms-node',cmsPageRoutes);
app.use('/knowledgebase-node',knowledgebaseRoutes);
app.use('/integration-node',integrationRoutes);
app.use('/chat-node',chatRoutes);
app.use('/support-node',supportRoutes);
app.use('/get-in-touch-node',getInTouchRoutes);
app.use('/stripe-node',planRoutes);
app.use('/stripe-node',stripeRoutes);
app.use('/order-node',OrderShopifyRoutes);
app.use('/customer-node',customerRoutes);
app.use('/profile-node',profileRoutes);
app.use('/product-node',productRoutes);
app.use('/product-node',productVariationRoutes);
app.use('/vendor-product-node',vendorProductRoutes);
app.use('/catalog-node',catalogRoutes);
app.use('/user-catalog-node',userCatalogRoutes);
app.use('/user-vendor-node',userVendorRoutes);
app.use('/vendor-customer-node',vendorCustomerRoutes);
app.use('/vendor-order-node',vendorOrderRoutes);

app.use('/pub-sub-customer-node',pubSubCustomerRoutes);
app.use('/pub-sub-order-node',pubSubOrderRoutes);
app.use('/pub-sub-product-node',pubSubProductRoutes);
app.use('/pub-sub-vendor-product-node',pubSubVendorProductRoutes);

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});

