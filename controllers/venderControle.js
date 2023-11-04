const { response } = require('../app');
const COURT = require('../models/courtSchenma');
const multer =require('multer');

const registerNewCourt=(req,res)=>{
    console.log(req.query);
    try {
        const fileStorage = multer.diskStorage({
            destination:(req,file,cb)=>{
                cb(null, "public/venderImages/")
            },
            filename: (req, file, cb)=>{
               cb(null,Date.now()+'-'+file.originalname);
            }
         });
         
         const upload = multer({
            storage: fileStorage,
         }).single("image");
         upload(req,res,(err)=>{
            console.log(req.file.filename,);
            COURT({
               businessName:req.query.businessName,
               location:req.query.location,
               venueType:req.query.venueType,
               feature:req.query.feature,
               mobileNumber:req.query.number,
               aboutVenue:req.query.about,
               image:req?.file?.filename 


            }).save().then(resp=>{
                res.status(200).json({message:'court registration successful'})
            }).catch ((response)=> {
                res.status(406).json({message:'all field is required'})
            })
         })
    
    
        
    } catch (error) {
        res.status(406).json({message:'all field is required'})
    }

}

const getMyCourtData=(req,res)=>{
    try {
        COURT.find({userId:req.userId}).then((response)=>{
            res.status(200).json({data:response})
         })
        
    } catch (error) {
        
    }
    
}       

const getSingleCourtData=(req,res)=>{
try {
        COURT.findOne({_id:req.query.courtId}).then((response)=>{
            res.status(200).json({data:response})
        })  
} catch (error) {
    
}
}


module.exports={registerNewCourt,getSingleCourtData,getMyCourtData}