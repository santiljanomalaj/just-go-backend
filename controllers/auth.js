const Auth = require('../models/auth');
const User = require('../models/user');
const Sms = require('../models/sms');
var jwt = require('jsonwebtoken');
const smsSender = require('../utils/sendSms');

var otpGenerator = require('otp-generator');

exports.sendOtp = (req, res, next) => {
  let otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  const phone = req.body.phone.replace(/\D/g, '');

  return Auth.findOne({ phone: phone })
    .then((result) => {
      if (result) {
        result.otp = otp;
        return result.save();
      }
      const auth = new Auth({ phone: phone, otp: otp });
      return auth.save();
    })
    .then((result) => {
      return Sms.findOne({ status: 'OTP' });
    })
    .then((sms) => {
      smsSender.sendSms(phone, sms.msg + ' ' + otp);
      return res.status(201).json({
        success: true,
        otp: otp,
        msg: 'OTP sent successfully!',
      });
    })

    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
      });
    });
};

exports.verifyOtp = (req, res, next) => {
  const phone = req.body.phone.replace(/\D/g, '');
  const { otp, referredBy } = req.body;

  return Auth.findOne({ phone: phone })
    .then((result) => {
      if (result) {
        if (result.otp === otp) {
          return User.findOne({ phone: phone }).then((user) => {
            var token;
            if (user && user.token) {
              token = user.token;
              return res.status(201).json({
                success: true,
                token: token,
                msg: 'OTP matched!',
              });
            } else if (user) {
              token = jwt.sign({ phone: phone }, process.env.JWT_PRIVATE_KEY);
              user.token = token;
              return user.save().then((result) => {
                return res.status(201).json({
                  success: true,
                  token: token,
                  msg: 'OTP matched1!',
                });
              });
            } else {
              return User.findOne({ referralCode: referredBy }).then((usr) => {
             
                const user = new User({
                  token,
                  phone,
                  role: 'user',
                  credit: 10,
                  referredBy: usr? usr._id : '',
                });
                token = jwt.sign({ phone: phone }, process.env.JWT_PRIVATE_KEY);
                return user.save().then((result) => {
                  return res.status(201).json({
                    success: true,
                    token: token,
                    msg: 'OTP matched2!',
                  });
                });
              });
            }
          });
          //delete auth from database
        }
      }
      return res.status(400).json({
        success: false,
        msg: 'OTP not matched!',
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: 'Something went wrong',
      });
    });
};
