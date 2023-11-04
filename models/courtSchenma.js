const mongoose = require('mongoose');

const courtSchema =mongoose.Schema ({

    businessName:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    venueType:{
        type:String,

        required:true
    },
    feature:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    aboutVenue:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
        
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'users'

    }
})

const COURT = mongoose.model('court',courtSchema)
module.exports= COURT