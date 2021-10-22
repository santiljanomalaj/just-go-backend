var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order')
exports.getSession = async (req, res) => {
  const payload = {
    success_url: req.body.success_url,
    cancel_url: req.body.cancel_url,
    payment_method_types: req.body.payment_method_types,
    mode: req.body.mode,
    line_items: req.body.line_items,
  };
  const session = await stripe.checkout.sessions.create(payload);
  res.send({ session });
};

exports.paymentVerified = (req, res) => {
  const sessionId = req.body.sessionId;

  stripe.checkout.sessions
    .retrieve(
      sessionId
    )
    .then((session) => {
      if(session.payment_status === 'paid'){
        Order.findOne({transactionId: sessionId}).then(order=>{
          console.log(order.status)
          if(order){
            order.status = 'PENDING'
            return order.save()
          }
          const err = new Error('Order not found')
          err.statusCode = 404
          throw err
        }).then(order=>{
          console.log(order.status)

          return res.json({order: order})
        }).catch(error=>{
          conosle.log(error)
          next(error)
        })
      }
    });
};
