const Shopify = require('shopify-api-node');
const Order = require("../../models/order");
const Integration = require("../../models/integration");
    

exports.syncOrder =  (req,res) =>{
  //page_info = req.body.page_info;
  const id = req.params.integration_id;
  Integration.findOne({_id : id})
    .then( async data => {
      if (data) {
        const shopify = new Shopify({
          shopName: data.domain,
          accessToken: data.access_token
        });
          

        //order_data = await shopify.order.list();
        const store_id = data.store_id;
        
        order_data=[];
        let params = { limit: 250 };
        // product_data =  await shopify.product.list(params);
        do {
          const orders = await shopify.order.list(params);
          await Promise.all(orders.map(async (element) => {
            order_data.push(element);
          }))
          
          params = orders.nextPageParameters;
          
        } while (params !== undefined);
        
        Order.remove({ store_id : store_id })
        await Promise.all(order_data.map(async (element) => {
          product_ids = [];
          variant_ids = [];
          Promise.all(element.line_items.map(async (line_item) => {
              product_ids.push(line_item.product_id);
              variant_ids.push(line_item.variant_id);
          }));
          
          order_content = {
          
              store_id : store_id,
              created_at : element.created_at,
              updated_at : element.updated_at,
              subtotal : element.subtotal_price,
              total : element.total_price,
              closed_at : element.closed_at,
              shopify_order_id : element.id,
              note : element.note,
              token :element.token,
              gateway : element.gateway,
              total_weight : element.total_weight,
              total_tax : element.total_tax,
              taxes_included : element.taxes_included,
              currency : element.currency,
              financial_status : element.financial_status,
              confirmed : element.confirmed,
              total_discounts : element.total_discounts,
              total_line_items_price : element.total_line_items_price,
              cart_token : element.cart_token,
              name : element.name,
              cancelled_at : element.cancelled_at,
              cancel_reason : element.cancel_reason,
              total_price_usd : element.total_price_usd,
              checkout_token : element.checkout_token,
              processed_at : element.processed_at,
              device_id : element.device_id,
              app_id : element.app_id,
              browser_ip : element.browser_ip,
              fulfillment_status : element.fulfillment_status,
              order_status_url : element.order_status_url,
              customer_id : element.customer.id,
              variant_ids : JSON.stringify(variant_ids),
              product_ids: JSON.stringify(product_ids)
          }	


          Order.create(order_content);

      }));
      return res.json(
          {message:"Order Synced Successfully"});
      }else{
        res.status(401).send({
          message : "Store Not Found."
        });
      }
  }) .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while Syncing."
      });
    });   
} 

exports.getOrderAccordingtoStore = async (req,res) =>{
  
      
    store_id =req.body.store_id!=null ? req.body.store_id : [];
    if(store_id==0){
      store_id = await Integration.find({account_id :req.body.account_id,deleted_at:null}).select('store_id');
      store_id = pluck(store_id, 'store_id');
    }
       
  const search_string = req.body.search_string!=null ? req.body.search_string : "";
  const page = req.body.page!=null ? req.body.page : 1;
  const options = {
    page: page,
    limit: 10,
    collation: {
      locale: 'en',
    },
  };
  if(req.body.startedDate!=null && req.body.endDate!=null ){
    
    const startedDate = new Date(req.body.startedDate);
    const endDate = new Date(req.body.endDate);
    endDate.setDate(endDate.getDate() + 1);
    

    result = await Order.paginate({ store_id: { $in: store_id } ,
      created_at: {
        $gte: startedDate,
        $lte: endDate
    },
      $or:[
            {'name': { $regex: '.*' + `${search_string}` + '.*' }},
            {'total': { $regex: '.*' + `${search_string}` + '.*' }},
            {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
          ]
    }, options, function (err, result) {
      return res.json(result);
    });
  }else{
    result = await Order.paginate({ store_id: { $in: store_id } ,
            $or:[
        {'name': { $regex: '.*' + `${search_string}` + '.*' }},
        {'total': { $regex: '.*' + `${search_string}` + '.*' }},
        {'subtotal': { $regex: '.*' + `${search_string}` + '.*' }},
        ]
    }, options, function (err, result) {
      return res.json(result);
    });
  } 
}

  exports.getSingleOrder = async (req,res) =>{
    const id = req.params.order_id;
    result = await Order.findOne({_id : id});
    return res.json({data:result});
  }