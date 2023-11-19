var express = require('express');
const { registerNewCourt, getMyCourtData, getSingleCourtData, addCourtTimings, getUpdatedDate, getAllCourtData } = require('../controllers/venderControle');
var router = express.Router();
const venderAuth = require('../middleWare/venderAuth');
const userAuth = require('../middleWare/userAuth');

/* GET users listing. */
router.post('/register-court', venderAuth, registerNewCourt)
router.get('/getMyCourtData', venderAuth, getMyCourtData)
router.get('/getSigleCourtViewData', venderAuth, getSingleCourtData)
router.post('/addCourtTiming', venderAuth , addCourtTimings)
router.get('/getUpdatedDate', venderAuth, getUpdatedDate)
router.get('/getAllCourtData',userAuth, getAllCourtData)

module.exports = router;
