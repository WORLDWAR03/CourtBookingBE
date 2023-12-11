const jwt =  require('jsonwebtoken');
const user = require('../models/userSchema');

const userAuth =(req,res,next)=>{
      try {
           
         const token = req.headers['authorization'].split(" ");
         
         jwt.verify(token[1], process.env.JWT, (err, decodedToken) =>{
         
            if(decodedToken){
                if(decodedToken?.role === 1 || decodedToken?.role === 2 || decodedToken?.role === 3) {
                   req.userId = decodedToken.userId;
                   next()
                }else{
                    res.status(401).json({message:"unautorized request"})

                }
            }
         })
      } catch (error) {
        res.status(403).json({message:'something went wrong'})
      }
}


module.exports = userAuth