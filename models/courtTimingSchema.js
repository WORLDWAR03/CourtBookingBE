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
    bookedBy:{
        type:mongoose.Types.ObjectId,
        ref:'users'
    },
    cancellation:{
        type:Array,
    },
    courtId:{
        type:mongoose.Types.ObjectId,
        ref:'courts'
    }


})

const COURT_SCHEDULES = mongoose.model('courtSchedules',courtScheduleSchema)
module.exports = COURT_SCHEDULES ;