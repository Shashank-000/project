const express = require('express');
const user = require('../models/user');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var ls = require('local-storage');

const {JWT_SECRET} = require('../valuekeys');
const requireLogin = require('../middleware/requireLogin.js');
const { response } = require('express');
//const history = useHistory();

router.get("/",(req,res)=>{
    res.send("hello world");
})

router.post("/signup",(req,res)=>{
    console.log("secuss");
    const{name,email,password} = req.body;
    console.log(name);
    console.log(email);
    
    if(!name || !email || !password)
    {
        res.json({error:"please give all imf."});
    }
    User.findOne({email:email}).then((savedUser=>{
        if(savedUser)
        {
            return res.json({error:"email already registered."});
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            const  user =  new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
            .then(user=>{
                res.json({message:"saved succeffuly"})
            }).catch(err=>{
                console.log(err);
            })
        })
        
    
    })).catch(err=>{
        console.log(err);
    })
})
router.post("/signin",(req,res)=>{
    console.log("routed into backend");
    const {email,password} = req.body;
    if(!email||!password)
    {
        res.status(422).json({error:"please add email & passowrd"})
    }
        user.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser){
                return res.status(422).json({error:"Invalid email "})
            }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
            //res.json({message:"successfully signed in"})
            const token = jwt.sign({id:savedUser.id},'abc');
            const {name,id,email} = savedUser;
            ls('mytoken',token);
            return res.json({token,user:{id,name,email}})
            
        }
        else{
            return res.status(422).json({error:"Invalid email or password"})
        }
    }).catch(err=>{
        console.log(err)
    })
}) 
})
router.get("/signout",function(res,req,next)
{
    ls.remove('mytoken');
    console.log("logged Out");;
});
router.get("/protected",checklogin,(req,res)=>{
    
    console.log("login verrified");
})
function checklogin(req,res,next){
    var mytoken=ls.get('mytoken');
    try{
        jwt.verify(mytoken, 'abc');
    }catch(err){
        res.json("you need  to login.");
    }
    next();
}
module.exports = router