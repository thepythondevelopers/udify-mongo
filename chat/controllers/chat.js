const Chat = require("../../models/chat");
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.saveChat = async (req,res) =>{
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(402).json({
          error : errors.array()
      })
  }
              
    
    content = {
        send_by : req.user._id,
        send_to : req.body.send_to,
        message : req.body.message
    }  
    
    chat =new Chat(content);
    chat.save((err,chat)=>{
        if(err){
            return res.status(400).json({
                message : err
            })
        }
        return res.json(content);
    })          
      
}

exports.getChat = async (req,res) =>{
  
         
      user_id = req.params.user_id;
    result = await Chat.aggregate([
        { $match: { $or: [ { send_by: ObjectId(req.user._id) }, { send_to: ObjectId(req.user._id) },
            { send_to: ObjectId(user_id) },{ send_to: ObjectId(user_id) } ] } },
        {$sort: {_id: -1}},
        { $group: { _id :{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },doc: { $push : "$$ROOT" } } },
        
        
        
      ])     
     return res.json(result);    
        
  }
