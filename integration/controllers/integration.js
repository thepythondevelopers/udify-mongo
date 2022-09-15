const Integration = require("../../models/integration");
const {validationResult} = require("express-validator");
const Shopify = require('shopify-api-node');
const { v4: uuidv4 } = require('uuid');

exports.createIntegration = async (req,res) =>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const shopify = new Shopify({
    shopName: req.body.domain,
    accessToken: req.body.access_token
  });
  let params = { limit: 1 };
            const products = await shopify.product.list(params).then( async data => {
 
   integration_found = await Integration.findOne({store_api_key:req.body.store_api_key,
    store_api_secret:req.body.store_api_key,
    domain:req.body.domain,
    access_token:req.body.access_token});
    if(integration_found!=null){
        return res.status(401).json({
            message : "This Shopify Account is already in Udify."
        })
    }             
  store_id = uuidv4();
  store_id = store_id.replace(/-/g,"");
  req.body.store_id = store_id;
    

     await Integration
      .create(req.body)
      .then(integration => {
        return res.json(integration);
      }).catch((err)=>{
        return res.status(400).json({
            message : "Unable to save in db",
            error : err 
        })
      })  
            }).catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while Syncing."
              });
            });
   
}

exports.findIntegration = (req,res) =>{
    const id = req.params.id;
    Integration.findOne({_id:id,account_id :req.body.account_id,deleted_at: null}).exec((err,integration)=>{
        if(err){
            return res.status(400).json({
                message : "Something Went Wrong"
            })
        }
        return res.json(integration);
    })    
  }
  
exports.findAllIntegration = (req, res) => {
    account_id = req.body.account_id;
    Integration.find({account_id :req.body.account_id,deleted_at: null}).select('-access_token -store_api_key -store_api_secret').exec((err,integration)=>{
      if(err){
          return res.status(400).json({
              message : "No Data Found"
          })
      }
      return res.json(integration);
  })    



}

exports.updateIntegration = async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
  const id = req.params.id;
  content =  { store_api_key: req.body.store_api_key, 
    store_api_secret: req.body.store_api_secret,
    domain: req.body.domain,
    access_token: req.body.access_token
  }
  
  integration_found = await Integration.findOne({ _id: { $ne: id },store_api_key:req.body.store_api_key,
    store_api_secret:req.body.store_api_key,
    domain:req.body.domain,
    access_token:req.body.access_token});
    if(integration_found!=null){
        return res.status(401).json({
            message : "This Shopify Account is already in Udify."
        })
    }

  Integration.findOneAndUpdate(
    { _id: id ,account_id :req.body.account_id,deleted_at:null},
    {$set : content},
    {new: true},
    (err,integration) => {
        if(err){
            return res.status(404).json({
                error : err
            })
        
        }

        if(integration===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json(integration);
    }
    )   
}

exports.deleteIntegration = (req,res)=>{
  const id = req.params.id;
  const account_id = req.body.account_id;
  Integration.findOneAndUpdate(
    { _id: id ,account_id :account_id},
    {$set : {deleted_at : Date.now()}},
    {new: true},
    (err,integration) => {
        if(err){
            return res.status(404).json({
                error : err
            })
        
        }
        if(integration===null){
            return res.status(404).json({
                message : "No Data Found"
            })
        }

        return res.json(integration);
    }
    )   
}