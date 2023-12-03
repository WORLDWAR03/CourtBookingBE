var express = require('express');
const router = express.Router();
const userAuth = require('../middleWare/userAuth');
const {generateOrder,success}= require('../controllers/payment')


 router.post('/generateOrder',userAuth, generateOrder)
 router.post('/success',userAuth, success)


 module.exports = router;