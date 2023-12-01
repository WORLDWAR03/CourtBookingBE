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
    console.log(req.query.date);
    console.log(req.query.courtId);
    console.log(req.query.currentHour)
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
            courts:1

           
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



module.exports =  {getBookingPage, getAvailableSlots}