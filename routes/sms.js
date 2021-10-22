const express = require('express');

const smsController  = require('../controllers/sms')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.put('/update-sms', smsController.updateSms)

router.get('/get-sms', smsController.getSms)


module.exports = router
