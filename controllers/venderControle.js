const COURT = require('../models/courtSchenma');
const multer =require('multer');
const COURT_SCHEDULES =require('../models/courtTimingSchema')

const registerNewCourt=(req,res)=>{
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
           
            COURT({
               businessName:req.query.businessName,
               location:req.query.location,
               venueType:req.query.venueType,
               feature:req.query.feature,
               mobileNumber:req.query.number,
               aboutVenue:req.query.about,
               image:req?.file?.filename ,
               userId:req.userId


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
            console.log(response,'eeeeeeekrkrr');
        })  
} catch (error) {
    
}
}

const addCourtTimings=(req,res)=>{
    console.log(req.body);
    try {
      let currentDate= new Date(req.body.dates.startDate);
      console.log(currentDate,'***********************************');
      const endDate= new Date(req.body.dates.endDate);
      const timingObjectArray=[]

      while (currentDate<=endDate) {
       for (let i = 0; i < req.body.schedules.length; i++) {
        timingObjectArray.push({
                date:JSON.parse(JSON.stringify(currentDate)),
                slot:{
                    name:req.body.schedules[i].name,
                    id:req.body.schedules[i].id
                },
                 cost:req.body.cost.cost,
                 courtId:req.body.courtId,
        })
        
       }
      currentDate.setDate(currentDate.getDate()+1)
    
    }

    COURT_SCHEDULES.insertMany(timingObjectArray).then((resp)=>{
        res.status(200).json({message:'schedules added successfully'})
    }
    )
        
    } catch (error) {
        res.status(406).json(error)
    }

}

const getUpdatedDate =(req,res)=>{
    try {
        console.log(req.query.courtId,'wtf');
        COURT_SCHEDULES.find({courtId:req.query.courtId}).sort({date:-1}).limit(1).select('date').then((resp)=>{
            console.log(resp,'helloww im here');
            let latestDate= new Date(resp[0]?.date)
            res.status(200).json({startingDate:latestDate})
        })
    } catch (error) {
        res.status(406).json(error)
    }
}

const ITEMS_PER_PAGE = 2;

const getAllCourtData=(req,res)=>{

    const page =req.query.page || 1;
    const dataPerPage = 6;

    
    

    try {

        

        COURT.find().skip((page -1) * dataPerPage).limit(dataPerPage)
        .then((resp)=>{
            res.status(200).json({courts:resp})
        })
        .catch((err)=>{
            res.status(400).json({message:'something went wrong'})
        })


        
    } catch (error) {
        res.status(406).json(error)
    }
     

}

      
 
   


module.exports={registerNewCourt,getSingleCourtData,getAllCourtData,
    getMyCourtData,
    addCourtTimings,getUpdatedDate}
