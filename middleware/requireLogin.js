    const jwt = require('jsonwebtoken');
    const {JWT_SECRET} = require('../valuekeys.js');
    const mongoose =require('mongoose');
    const User = mongoose.model("User")


    module.exports =(req,res,next)=>{
    const {authorization} = req.headers;
    
    if(!authorization){
        res.status(401).json({error:"You musted be logged in"});
    }
    const token = authorization.replace("bearer","");
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(402).json({error:"You musted be logged in."})
        }
        const {id} = payload
    
        User.findById(id).then(userdata=>{
            req.user = userdata
        })

        next();
    })
}