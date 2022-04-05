const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs =require('ejs');
const { json } = require("body-parser");
const pdf = require('express-pdf');
const { response } = require('express');
const{MONGOURI} = require("./valuekeys.js");


//Atlas password :9dzFh1SdNXP6gjag
require('./models/user')
app.use(express.json());
app.use(require('./routes/auth'));
//mongoose connection
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
    console.log("We connected to mongoDb.")
})
mongoose.connection.on('error',()=>{
    console.log("Not connected to mongoDb.")
})



const customMiddleware = (req,res,next) =>{
    console.log("This is a Middleware.");
}


var router = express.Router()
app.use(bodyparser.urlencoded({extended:false}))


app.listen(4000,function(){
    console.log("server has started.")
})

// router.post("/ex_back", (req,res)=>
// {
//    //const{name,email} = req.body;
//     console.log("Success");
//     //console.log(JSON.stringify(email));
//     //console.log(email);
//     //res.write("Heloo there");
//     //res.send();
// });

app.use(pdf);
app.use('/pdfFromHTML', function(req, res){
    res.pdfFromHTML({
        filename: 'generated.pdf',
        html: path.resolve(__dirname, './template.html')
        //options: {...}
    });
});
app.use('/pdfFromHTMLString', function(req, res){
    res.pdfFromHTML({
        filename: 'generated.pdf',
        htmlContent: '<html><body>ASDF</body></html>'
        //options: {...}
    });
});
app.use('/pdf', function(req, res){
    res.pdf(path.resolve(__dirname, './original.pdf'));
})


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");



// mongoose.connect("mongodb://localhost:27017/mydb");
//     const schema = {
//         fname:String,
//         sname:String,
//         email:String,
//         password:String
//     };

//     // const Article = mongoose.model("userProfile",schema);


// app.post('/Login',function(req,res){
//     iemail=(req.body.email),
//     ipassword=(req.body.password)

//     Article.findOne({email: iemail},'email password',function(err,result){
//         if(!err)
//         {
//             //console.log(result);
//             answer=JSON.stringify(result);
//             finalAnswer=JSON.parse(answer);
//             if(finalAnswer.password === ipassword){
//                 res.write("Logged In As:"+iemail);
//                 res.send();
//             }else{
//                 res.write("Wrong password");
//                 res.send();
//             }
//             //const r1 = JSON.stringify(result);
//             //console.log(r1);
//         }else{
//             console.log(err);
//         }
//     })
// });

// app.post('/register',function(req,res){
//     response.write("sucess");
//     res.send();    
// })


// app.post('/',function(req,res){

//     const newvalue = Article ({
//         fname:(req.body.fname),
//         sname:(req.body.sname),
//         email:(req.body.email),
//         password:(req.body.password)
//     });
//     newvalue.save();
//     console.log(req.body.fname);
// });