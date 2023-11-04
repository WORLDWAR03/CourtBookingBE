var express = require('express');
const { registerNewCourt, getMyCourtData, getSingleCourtData } = require('../controllers/venderControle');
var router = express.Router();
const venderAuth = require('../middleWare/venderAuth')

/* GET users listing. */
router.post('/register-court', venderAuth, registerNewCourt)
router.get('/getMyCourtData', venderAuth, getMyCourtData)
router.get('/getSigleCourtViewData', venderAuth, getSingleCourtData)


module.exports = router;
