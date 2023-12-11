const COURT = require('../models/courtSchenma')
const COURT_SCHEDULES = require('../models/courtTimingSchema')
const mongoose =require('mongoose')
const ObjectId =require('mongoose').Types.ObjectId




const getBookingPage=(req,res)=>{
    try {
        COURT.findOne({_id:req.query.id}).then((resp)=>{
            res.status(200).json({data:resp})
        })
    } catch (error) {
        
    }
    
}

const getAvailableSlots=(req,res)=>{
   
    try {

    COURT_SCHEDULES.aggregate([{
       $match:{
        courtId: new ObjectId(req.query.courtId),
        date: new Date(req.query.date.split('T')[0]),
        'slot.id':{$gt:parseInt(req.query.currentHour)}

       }
    },
    {
        $lookup:{
            from:"courts",
            localField: "courtId",
            foreignField:"_id",
            as:"courts"
        }
    },
    {
        $project:{
            _id:1,
            date:1,
            slot:1,
            cost:1,
            courts:1,
            bookedBy:1,
            
        }
    }

    ])
       .then((resp)=>{
            console.log(resp,'tttuooooorrrrrrrrrcccccccj');
            res.status(200).json({resp})
        }) .catch((err)=>{
            console.log(err);
        })

    } catch (error) {
        
    }
}

const getMyBookings=(req,res)=>{
    const currentDate = new Date();
    const slotId = currentDate.getHours();
    currentDate.setUTCHours(0,0,0,0);
    console.log(currentDate,slotId);
   
    try {
   
        COURT_SCHEDULES.aggregate([
            {$match:{
                bookedBy:new ObjectId(req.userId),
                $expr:{
                    $or:[
                        { $gt:['$date',currentDate]},
                        { $and:[
                          {$eq:['$date',currentDate]},
                          {$gt:['$slot.id',slotId]},
                     ]},
                    ]
                    
                },

            }},{
                $lookup:{
                    from:"courts",
                    localField:"courtId",
                    foreignField:"_id",
                    as: "courts"       }
            },
           { $project:{
                  _id:1,
                  date:1,
                  slot:1,
                  cost:1,
                  courts:{$arrayElemAt:["$courts", 0]}
                  
            }}
        ]).then((resp)=>{
            res.status(200).json(resp)
        })
    } catch (error) {
        
    }
}

const getPreviousBookings=(req,res)=>{
    const currentDate = new Date();
    const slotId = currentDate.getHours();
    currentDate.setUTCHours(0,0,0,0);
    console.log(currentDate,slotId);
    try {
        COURT_SCHEDULES.aggregate([
            {$match:{
                bookedBy:new ObjectId(req.userId),
                $expr:{
                    $or:[
                        { $lt:['$date',currentDate]},
                        { $and:[
                          {$eq:['$date',currentDate]},
                          {$lt:['$slot.id',slotId]},
                     ]},
                    ]
                    
                },

            }},{
                $lookup:{
                    from:"courts",
                    localField:"courtId",
                    foreignField:"_id",
                    as: "courts" }
            },
           { $project:{
                  _id:1,
                  date:1,
                  slot:1,
                  cost:1,
                  courts:{$arrayElemAt:["$courts", 0]}
                  
            }}
        ]).then((resp)=>{
            res.status(200).json(resp)
        })  
    } catch (error) {
        
    }

}



module.exports =  {getBookingPage, getAvailableSlots, getMyBookings, getPreviousBookings}