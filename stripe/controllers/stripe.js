const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const StripeSubscription = require("../../models/stripeSubscription");
const Plan = require("../../models/plans");
const User = require("../../models/user");
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_KEY);




exports.stripeSubscription = async (req,res)=>{
  
  card =  {
    number: req.body.number,
    exp_month: req.body.exp_month,
    exp_year: req.body.exp_year,
    cvc: req.body.cvc,
  }

  await stripe.paymentMethods.create({
      type: 'card',
      card: card,
      billing_details: {
        name: req.body.billing_details_name,
      },
    })
    .then( async (result) => {
      
      if (result.error) {
       // displayError(result);

      } else {
          public_id = req.user._id;
          customerId =  req.body.customerId;
          paymentMethodId = result.id;
          priceId = req.body.priceId;
          try {
            await stripe.paymentMethods.attach(paymentMethodId, {
              customer: customerId,
            });
          } catch (error) {
            return res.status('402').send({ error: { message: error.message } });
          }
        
          // Change the default invoice settings on the customer to the new payment method
          await stripe.customers.update(
            customerId,
            {
              invoice_settings: {
                default_payment_method: paymentMethodId,
              },
            }
          );
        
          // Create the subscription
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            expand: ['latest_invoice.payment_intent'],
          });
        
          
          
          subscription_data = {
            subscription_id : subscription.id,
            object : subscription.object,
            application_fee_percent : subscription.application_fee_percent,
            billing_cycle_anchor : subscription.billing_cycle_anchor,
            created : subscription.created,
            current_period_end : subscription.current_period_end,
            current_period_start : subscription.current_period_start,
            billing_thresholds : subscription.billing_thresholds,
            cancel_at : subscription.cancel_at,
            cancel_at_period_end : subscription.cancel_at_period_end,
            canceled_at : subscription.canceled_at,
            collection_method : subscription.collection_method,
            public_id : public_id,
            plan_id : priceId,
            customer_stripe_id : customerId, 
            status : subscription.status,
            latest_invoice_payment_intent_status : subscription.latest_invoice.payment_intent.status
          }
          //return res.json(subscription_data);
          await StripeSubscription.create(subscription_data);
          
          
          
          if(subscription.status=='active'){
            await Plan.findOne({  price_id: priceId  }).then( async data => {
              
              await User.findOneAndUpdate(
                {  _id: public_id },
                {$set : {plan_status:data.type}},
                {new: true},
                (err,user) => {
                    if(err){
                        return res.status(400).json({
                            message : "Unable to save in db",
                            error : err 
                        })
                    }   
                }
                )
            }).catch(err => {
              res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
            }); 
              
            res.json({message:"Successfully Subscribed."});
          }else{
            res.status(401).json({message:"The card was declined (that is, insufficient funds, card has expired, etc)"});
          }
       //   res.send(subscription);
      }
    });
}
