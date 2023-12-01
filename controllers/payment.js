const Razorpay = require("razorpay");
const COURT_SCHEDULES = require('../models/courtTimingSchema')


const generateOrder = async(req,res)=>{
    
      try {
        const slotData = await COURT_SCHEDULES.findOne({_id:req.body.slotId})
        if(slotData.bookedBy){
            res.status(500).json({message:"slot already booked"})
        }
        console.log(req.body.slotId);

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: slotData.cost * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: slotData._id,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
}
const success =async()=>{

}


module.exports = {generateOrder, success}