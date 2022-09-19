const Shopify = require('shopify-api-node');
require('dotenv').config();
const Integration = require("../../models/integration");
const VendorProduct = require("../../models/vendorProducts");
const VendorProductVariant = require("../../models/vendorProductVariants");
var pluck = require('arr-pluck');
const moment= require('moment');
const {validationResult} = require("express-validator");


exports.syncProduct = async (req,res) =>{

  integration_data = await Integration.find({role:'supplier'});
  
        Promise.all(integration_data.map(async (integration_element) => {
        
              const shopify = new Shopify({
                shopName: integration_element.domain,
                accessToken: integration_element.access_token
              });
              
        const store_id = integration_element.store_id;        
        const integration_id = integration_element._id;

         product_data=[];
        let params = { limit: 250 };

        do {
          const products = await shopify.product.list(params);
          await Promise.all(products.map(async (element) => {
            product_data.push(element);
          }))
          
          params = products.nextPageParameters;
          
        } while (params !== undefined);
        
        product_id = [];

         Promise.all(product_data.map(async (element) => {  
        product_id.push(""+element.id+"");
          product_content = {
            user_id : req.user._id,
            integration_id : integration_id,
              store_id : store_id,
              body_html:element.body_html,
              handle: "",
              id  : element.id,
              images : JSON.stringify(element.images),
              options:JSON.stringify(element.options),
              product_type:element.product_type,
              published_at : element.published_at,
              published_scope:element.published_scope,
              tags:element.tags,
              template_suffix:element.template_suffix,
              title:element.title,
              metafields_global_title_tag:"",
              metafields_global_description_tag:"",
              vendor:element.vendor,  
              status:element.status
          };
             VendorProduct.create(product_content);
             shopify_sync_variants(element.variants,store_id,integration_id,req.user._id);

          
                                  
          
    }));

    id =  await VendorProduct.find({store_id : store_id}).select('id');
    id = pluck(id, 'id');
   
   var difference = id.filter(x => product_id.indexOf(x) === -1);
   await VendorProduct.remove({id:{$in:difference}})
   await VendorProductVariant.remove({product_id:{$in:difference}})

    }));  
    return res.json({message:"Product Synced Successfully"});
        
        
   
    
}

function shopify_sync_variants(variants,store_id,integration_id,user_id) {
  
           Promise.all(variants.map(async (product_variant) => {  
        
            product_variant_data = {
              user_id : user_id,
              integration_id : integration_id,
                      store_id : store_id,
                      product_id : product_variant.product_id,
                      barcode :product_variant.barcode,
                      compare_at_price : product_variant.compare_at_price,
                      created_at : product_variant.created_at,
                      fulfillment_service : product_variant.fulfillment_service,
                      grams : product_variant.grams,
                      weight : product_variant.weight,
                      weight_unit : product_variant.weight_unit,
                      id : product_variant.id,
                      inventory_item_id : product_variant.inventory_item_id,
                      inventory_management : product_variant.inventory_management,
                      inventory_policy : product_variant.inventory_policy,
                      inventory_quantity : product_variant.inventory_quantity,
                      option1 : product_variant.option1,
                      option2 :  product_variant.option2,
                      option3 :  product_variant.option3,
                      position : product_variant.position,
                      price : product_variant.price,
                      presentment_prices : "",
                      shopify_product_id : product_variant.product_id,
                      requires_shipping : product_variant.requires_shipping,
                      sku : product_variant.sku,
                      taxable : product_variant.taxable,
                      title : product_variant.title,
                      image_id : product_variant.image_id
              }
                 VendorProductVariant.create(product_variant_data);

          }));
}
