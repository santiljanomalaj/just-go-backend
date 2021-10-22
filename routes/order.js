const express = require('express');

const orderController  = require('../controllers/order')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.get('/get-orders', orderController.getOrders)

router.get('/get-rider-orders/:riderId', orderController.getRiderOrders)


router.get('/get-orders/:id', orderController.getOrderById)

router.post('/new-order', orderController.newOrder)

router.get('/user-orders/:uid',isAuth, orderController.userOrders)


router.post('/change-status/',isAuth, orderController.changeStatus)
 
router.post('/assign-rider', orderController.assignRider)

router.post('/clear-tip', orderController.clearTip)
router.post('/avg-delivery-time', orderController.getAvgDeliveryTime)


module.exports = router
