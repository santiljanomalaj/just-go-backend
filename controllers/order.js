const Order = require('../models/order');

const smsSender = require('../utils/sendSms');

const User = require('../models/user');

const Sms = require('../models/sms');

exports.getOrders = (req, res, next) => {
  let status = req.query.status;
  if (status) {
    status = status.toUpperCase();

    Order.find({ status: status })
      .sort({ createdAt: -1 })
      .then((result) => {
        res.send({ orders: result });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } else {
    Order.find({status: {$ne: 'UNPAID'}})
      .sort({ createdAt: -1 })
      .then((result) => {
        res.send({ orders: result });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
};

exports.getRiderOrders = (req, res, next) => {
  const riderId = req.params.riderId;
  const date = req.query.date;

  Order.find({ riderId: riderId, orderedAt: {$gt: date} })
    .sort({ createdAt: -1 })
    .then((result) => {
      res.send({ orders: result });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.getOrderById = (req, res, next) => {
  const id = req.params.id;
  Order.findById(id)
    .then((result) => {
      console.log(result);
      return res.send({ order: result });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.newOrder = (req, res, next) => {
  const {
    address,
    deliveredAt,
    orderedAt,
    location,
    delivery,
    name,
    notes,
    phone,
    status,
    subtotal,
    total,
    tax,
    discount,
    uid,
    tip,
    products,
    transactionId,
  } = req.body;

  let userData = {};
  User.findById(uid)
    .then((user) => {
      if (user.credit >= discount) {
        user.credit -= discount;
        if (!user.recentAddress) user.recentAddress = [];
        let index = user.recentAddress.findIndex(
          (add) => add.address === address
        );
        if (index == -1)
          user.recentAddress.push({
            location: location,
            address: address,
          });

        return user.save();
      } else {
        const error = new Error('Not sufficiant credit to get discount');
        throw error;
      }
    })
    .then((user) => {
      console.log(user);
      userData = user;
      return Order.find({ uid });
    })
    .then((userOrders) => {
      const order = new Order({
        address,
        deliveredAt,
        delivery,
        name,
        notes,
        phone,
        status,
        subtotal,
        total: total.toFixed(2),
        tax,
        tip: +tip,
        discount,
        uid,
        products,
        orderedAt,
        location,
        transactionId,
        index: userOrders.length + 1,
      });

      return order.save();
    })
    .then((order) => {
      if (order.index === 1 && userData.referredBy) {
        User.findById(userData.referredBy).then((user) => {
          user.credit = +user.credit + 10;

          user.save().then((user) => {
            User.findById(uid).then((user) => {
              user.credit += 10;
              user.save().then((user) => {
                return res.send({ order });
              });
            });
          });
        });
      } else return res.send({ order });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.userOrders = (req, res, next) => {
  const uid = req.params.uid;
  Order.find({ uid })
    .sort({ createdAt: -1 })
    .then((result) => {
      return res.send({ orders: result });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.changeStatus = (req, res, next) => {
  const { id, status, deliveredAt } = req.body;
  Order.findById(id)
    .then((order) => {
      if (!order) {
        return res.status(404).send({ msg: 'Order not found' });
      }

      order.status = status.toUpperCase();
      order.deliveredAt = deliveredAt;
      return order
        .save()
        .then((order) => {
          return Sms.findOne({ status: order.status }).then((sms) => {
            if (sms) {
              smsSender.sendSms(order.phone, sms.msg);
            }
            return res.send({ order: order });
          });
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.assignRider = (req, res, next) => {
  const { id, riderId } = req.body;
  Order.findById(id)
    .then((order) => {
      if (!order) {
        return res.status(404).send({ msg: 'Order not found' });
      }
      order.riderId = riderId;
      return order.save();
    })
    .then((order) => {
      return res.send({ order: order });
    })

    .catch((err) => {
      throw err;
    });
};

exports.clearTip = (req, res, next) => {
  const { riderId } = req.body;
  console.log(riderId)
  let userData;
  User.findById(riderId)
    .then((user) => { 
      if (!user) {
        return res.status(404).send({ msg: 'User not found' });
      }
      userData = user;
      return Order.find({ riderId: riderId });
    })
    .then((orders) => {
      let sum = 0;
      orders.forEach((order) => {
        sum += +order.tip;
      });

      userData.clearedTip = sum;
      return userData.save();
    })
    .then((user) => {
      return res.send({ user: user });
    })

    .catch((err) => {
      throw err;
    });
};

exports.getAvgDeliveryTime = (req, res, next) => {
  const date = req.body.date
  
  console.log(date)
  Order.find({ status: 'DELIVERED',  orderedAt: {$gt: date}})
    .then((orders) => {
      let times = [];
      count = 0;
      orders.forEach((order) => {
        times.push({
          orderedAt: order.orderedAt,
          deliveredAt: order.deliveredAt,
        });
      });
      return res.json({
        times: times,
      });
    })
    .catch((error) => {
      console.log(error);
      throw err;
    });
};
