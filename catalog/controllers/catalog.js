const Catalog = require("../../models/catalog");
const {validationResult} = require("express-validator");
const VendorProduct = require("../../models/vendorProducts");
const VendorProductVariant = require("../../models/vendorProductVariants");

exports.createCatalog = async (req,res) =>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
              
  
    content = {
        user_id : req.user._id,
        product_id : req.body.product_id
    }  

     
      
      await Catalog.findOneAndUpdate(
        {user_id:req.user._id},
        {$set : content},
        {upsert: true, new: true},
        
        (err,catalog) => {
            if(err){
                return res.status(404).json({
                    error : err
                })
            
            }
    
    
            return res.json(catalog);
        }
        )
        
      
}

exports.getVendorCatalog = async (req,res) =>{
    Catalog.findOne({user_id:req.user._id}).exec(async (err,catalog)=>{
        if(err){
            return res.status(400).json({
                message : "Something Went Wrong"
            })
        }
        if(catalog==null){
            cat = []
            return res.json(cat);
        }
        product_id = catalog.product_id;
        if(product_id==null || product_id.length==0){
            cat = []
            return res.json(cat);
        }
        result = await VendorProduct.aggregate([
            { $match:{
                'id' : { $in: product_id }
              }},
            { 
              $lookup:
               {
                 from: 'productvariants',
                 localField: 'id',
                 foreignField: 'product_id',
                 as: 'variant'
               }
             }
            ])
        return res.json(result);
    })    
}    