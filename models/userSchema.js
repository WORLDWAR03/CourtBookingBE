const mongoose=require('mongoose');

const SignUpSchema =mongoose.Schema

({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:Number,
        default:2,
    },
})



const user=mongoose.model('users',SignUpSchema);
module.exports=user;
