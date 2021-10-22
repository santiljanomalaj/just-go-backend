const express = require('express');

const configController  = require('../controllers/config')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.put('/update-shop', configController.updateShop)

router.get('/get-shop', configController.getShop)


module.exports = router
