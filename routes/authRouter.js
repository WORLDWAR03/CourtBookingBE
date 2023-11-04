var express = require('express');
var router = express.Router();
const { doLogin, doSignUp } = require('../controllers/auth');


router.post('/register',doSignUp)
router.post('/login',doLogin)


module.exports=router;