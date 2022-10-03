const Chat = require("../../models/chat");
const {validationResult} = require("express-validator");


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
  
         
      
    result = await Chat.aggregate([
        {$sort: {_id: -1}},
        { $group: { _id :{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt"} },doc: { $push : "$$ROOT" } } },
        
        
        
      ])     
     return res.json(result);    
        
  }
