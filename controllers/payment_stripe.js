const mongoose = require('mongoose');
const User = require('../models/user');
var stripe = require('stripe')(process.env.NODE_ENV === "development" ? process.env.STRIPE_DEV_KEY : process.env.STRIPE_PROD_KEY);

async function updateUser (uid, customerId, last4) {
    const id = mongoose.Types.ObjectId(uid);
    const user = await User.findOne({ _id: id });
    user.customerId = customerId;
    user.last4 = last4;
    return user.save();
}

exports.getToken = (req, res) => {
   const data = req.query;

   stripe.tokens.create({
       card: {
           number: data.number,
           exp_month: data.exp_month,
           exp_year: data.exp_year,
           cvc: data.cvc
       }
   }, (err, response) => {
       if(err) {
           res.status(err.statusCode).send({
               error: err.type,
               status: err.statusCode,
               code: err.code
           });
       } else {
           res.status(200).send(response)
       }
   });
}

exports.createCustomer = async (req, res) => {
    const data = req.body;
    try {
        let customer;
        // same as payment_method_id
        if(data.source) {
            customer = await stripe.customers.create({
                email: data.email,
                name: data.name,
                address: data.address,
                phone: data.phone,
            });
        }
        if(customer) {
            res.status(200).send({customerId: customer.id, success:true, data:customer});
        } else {
            res.status(500).send({error:'Something went wrong'});
        }
    } catch(err) {
        return res.send({error: err.message});
    }
}

exports.charge = async (req, res) => {
   const data = req.body;
   try {
       let intent;
       if (data.choice == 2) {
           if(data.source) {
                customer = await stripe.customers.create({
                    email: data.email,
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    source: data.source
                });

                intent = await stripe.charges.create({
                    customer: customer.id,
                    amount: data.amount,
                    currency: 'usd',
               });

                await updateUser(data.userId, customer.id, intent.payment_method_details.card.last4);
           }
       } else {
            intent = await stripe.charges.create({
                customer: data.customerId,
                amount: data.amount,
                currency: 'usd',
           });        
       }
       if(intent.status === 'succeeded') {
           res.status(200).send({transactionId: intent.id, success:true, data:intent});
       } else {
           res.status(500).send({error:'Something went wrong'});
       }
   } catch(err) {
       return res.send({error: err.message});
   }
}

exports.getTransaction = async(req, res) => {
   const { transactionId } = req.params;
   try{
       let paymentIntent;
       if(transactionId) {
           paymentIntent = await stripe.paymentIntents.retrieve(
               transactionId
           );
           console.log('fetched transaction');
           return res.status(200).send({
               transaction: {
                   amount: paymentIntent.amount,
                   creditCard: {
                       cardType: paymentIntent.charges.data[0].payment_method_details.card.brand,
                       maskedNumber: 0
                   },
                   status: paymentIntent.status,
               }
           });
       } else {
           return res.status(422).send({'msg': 'missing transaction_id'});
       }
   }  catch(err) {
       return res.send({error: err.message});
   }
}

