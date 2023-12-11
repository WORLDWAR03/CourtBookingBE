const Razorpay = require("razorpay");
const COURT_SCHEDULES = require('../models/courtTimingSchema')
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const { log } = require("console");


const generateOrder = async(req,res)=>{
    
      try {
        const slotData = await COURT_SCHEDULES.findOne({_id:req.body.slotId})
        if(slotData.bookedBy){
            res.status(500).json({message:"slot already booked"})
        }

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
const success =async(req,res)=>{
    try {
        // getting the details back from our font-end
         const {
            receipt,
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
        console.log(req.body);

       

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        


        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });
         
        await COURT_SCHEDULES.updateOne({_id:receipt},{$set:{bookedBy:req.userId},$push:{ orderDetailes:{userId:req.userId,razorpayPaymentId,timeStamp:new Date()},}}) 
        initiateEmail(receipt)
        
        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }


}

const initiateEmail=async (id, razorpayPaymentId)=>{

let userData = await COURT_SCHEDULES.findOne({_id:id}).populate('bookedBy').populate('courtId')


const transporter = nodemailer.createTransport({
  service:"Gmail",
  auth: {
    user: "slook.in.here@gmail.com",
    pass: "guwp zcuj nmrr cbfp",
  },
});
console.log(userData,'userData here');    
const {date,slot,cost,bookedBy,courtId} = userData;
console.log(bookedBy,date,cost,courtId);

  const info = await transporter.sendMail({
    from: "slook.in.here@gmail.com", 
    to: "manjumurali3941@gmail.com", 
    subject: "Booking Confirmed ✔",
    text: "Hello world?", 
    html: `<b> Thankyou ${bookedBy.fullName} for choosing PlEY to book your playground.Your booking has been confirmed with${ razorpayPaymentId} for ${date.toISOString().split('T')[0]} at ${slot} in ${courtId.businessName} . stay fit stay healthy .</b>`, 
  });
  console.log("Message sent: %s", info.messageId);
}




module.exports = {generateOrder, success}