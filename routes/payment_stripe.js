const express = require('express');

const paymentStripeController  = require('../controllers/payment_stripe')
const router = express.Router();

// get token
router.get("/get-stripe-token", paymentStripeController.getToken);

// charge payment
router.post("/stripe-charge", paymentStripeController.charge);

module.exports = router
