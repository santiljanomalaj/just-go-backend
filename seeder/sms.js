require('dotenv').config();

var seeder = require('mongoose-seed');

const MONGODB_URI = `mongodb+srv://${process.env.MONOG_USERNAME}:${process.env.MONGO_PSWD}@cluster0.cm2ar.mongodb.net/${process.env.MONGO_DB}?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;
seeder.connect(MONGODB_URI, function () {
  // Load Mongoose models
  seeder.loadModels(['models/sms.js', 'models/config.js']);

  // Clear specified collections
  seeder.clearModels(['Sms', 'Config'], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });


});

var data = [
  {
    model: 'Sms',
    documents: [
      {
        status: 'OTP',
        msg: 'Your Just Go verification code is',
      },
      {
        status: 'CONFIRMED',
        msg: 'Thanks for ordering! Your order has been confirmed by JUST GO'
      },
      {
        status: 'ONWAY',
        msg: 'Your order is out for delivery, It will reach to you in some time.'
      },
      {
        status: 'DELIVERED',
        msg: 'Your order has been delivered. Thanks'
      },

    ],
  },

  {
    model: 'Config',
    documents: [
      {
        type: 'TIMING',
        status: true,
        statusTitle: 'Shop is closed right now',
        statusSubTitle: 'We will open again at 10AM!'
      },
      

    ],
  },
];

