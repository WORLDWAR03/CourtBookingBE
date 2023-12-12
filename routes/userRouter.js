var express = require('express');
const {getBookingPage, getAvailableSlots, getMyBookings, getPreviousBookings, forgetpassword, resetPassword, getThisScheduleData} =require('../controllers/userControle')
var router = express.Router();
const userAuth = require('../middleWare/userAuth');


router.get('/getBookingPage', userAuth, getBookingPage);
router.get('/getAvailableSlots', userAuth, getAvailableSlots);
router.get('/getMyBookings',userAuth, getMyBookings);
router.get('/getPreviousBookings',userAuth, getPreviousBookings); 
router.post('/forget-password', forgetpassword);
router.post('/reset-password',resetPassword);
router.get('/getThisScheduleData',userAuth, getThisScheduleData)



module.exports = router;