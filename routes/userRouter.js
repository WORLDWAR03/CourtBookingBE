var express = require('express');
const {getBookingPage, getAvailableSlots} =require('../controllers/userControle')
var router = express.Router();
const userAuth = require('../middleWare/userAuth');


router.get('/getBookingPage', userAuth, getBookingPage);
router.get('/getAvailableSlots', userAuth, getAvailableSlots)






module.exports = router;