var express = require('express');
const {getBookingPage, getAvailableSlots, getMyBookings, getPreviousBookings, forgetpassword, resetPassword, getThisScheduleData, cancelBooking, getCancelldBookings} =require('../controllers/userControle')
var router = express.Router();
const userAuth = require('../middleWare/userAuth');


router.get('/getBookingPage', userAuth, getBookingPage);
router.get('/getAvailableSlots', userAuth, getAvailableSlots);
router.get('/getMyBookings',userAuth, getMyBookings);
router.get('/getPreviousBookings',userAuth, getPreviousBookings); 
router.post('/forget-password', forgetpassword);
router.post('/reset-password',resetPassword);
router.get('/getThisScheduleData',userAuth, getThisScheduleData);
router.put('/cancelBooking',userAuth, cancelBooking);
router.get('/getCancelldBookings',userAuth, getCancelldBookings);



module.exports = router;