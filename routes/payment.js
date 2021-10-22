const express = require('express');

const paymentController  = require('../controllers/payment')
const router = express.Router();

router.post("/get-session", paymentController.getSession);

router.post("/payment-verified", paymentController.paymentVerified); 


// router.get("/get-transection/:transectionId", paymentController.getTransection);




module.exports = router
