const user = require('../models/userSchema');
const USER=require('../models/userSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




const doSignUp=(req,res)=>{
    try {
  

        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt,  (err, hash) => {
                console.log(hash)
               
                    USER({
                    fullName:req.body.fullName,
                    email:req.body.email,
                    password:hash, 

                }).save().then((response)=>{
                    res.status(200).json({signup:true})
                })
            });
        });
    
    } catch (error) {
        console.log(error);
        res.status(502).json({signup:false,message:error})
    }


}

const doLogin = async (req,res)=>{
    try {
        const user = await USER.findOne({
            email:req.body.email
           })
           console.log(user,'user');
           if(user){
            bcrypt.compare(req.body.password, user.password,  function(err, hashRes) {
               console.log(hashRes,"responsr after password checking");

           if(hashRes){
            const token =jwt.sign({userId:user._id,email:user.email, fullName:user.fullName, role:2},process.env.JWT,{
                expiresIn:'2d',

            })
            user.password=undefined
          
            res.status(200).json({login:true,token:token,user:user})
           }else{
            res.status(403).json({login:false,})
           }
        
              });
           }
        
    } catch (error) {
        console.log(error);
    }

}
   
module.exports={doLogin, doSignUp}