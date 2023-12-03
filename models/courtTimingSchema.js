const  mongoose  = require("mongoose");

const courtScheduleSchema = mongoose.Schema({

    date:{
        type:Date,
        required:true,  
    },
    slot:{
        type:Object,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    cancellation:{
        type:Array,
    },
    courtId:{
        type:mongoose.Types.ObjectId,
        ref:'courts'
    },
    bookedBy:{
        type:mongoose.Types.ObjectId,
        ref:'users'
    },
    orderDetailes:{
       type:Array,


    }


})

const COURT_SCHEDULES = mongoose.model('courtSchedules',courtScheduleSchema)
module.exports = COURT_SCHEDULES ;