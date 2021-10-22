const User = require('../models/user');
const roles = ['user', 'admin', 'rider']

exports.saveUser = (req, res, next) => {
  const { fname, sname, phone, referredBy } = req.body;
  
  User.findOne({ phone: phone })
    .then((user) => {
      console.log(user._id.toString().substr(18));
      if (!user.referredBy) user.referredBy = referredBy;
      if (!user.referralCode)
        user.referralCode = user._id.toString().substr(18);
      user.fname = fname;
      user.sname = sname;
      // user.role = 'admin';
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        msg: 'User Saved!',
        success: true,
        user: {
          fname: user.fname,
          sname: user.sname,
          phone: user.phone,
          role: user.role,
          credit: user.credit,
          referredBy: user.referredBy,
          uid: user._id,
          recentAddress: user.recentAddress,
        },
      });
    });
};

exports.getUser = (req, res, next) => {
  const phone = req.phone;

  User.findOne({ phone: phone })
    .then((user) => {
      if (user) {
        return res.status(201).json({
          user: {
            fname: user.fname,
            sname: user.sname,
            phone: user.phone,
            credit: user.credit,
            referredBy: user.referredBy,
            role: user.role,
            uid: user._id,
            recentAddress: user.recentAddress,
            customerId: user.customerId,
            last4: user.last4
          },
        });
      }
      return res.status(404).json({
        msg: 'User not found!',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUsers = (req, res, next) => {
  console.log(roles)
  User.find()
    .then((users) => {
      return res.status(201).json({
        users:users,
        roles: roles
      });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.changeRole = (req, res, next) => {
  const uid = req.body.id;
  const role = req.body.role;

  User.findById(uid)
    .then((user) => {
      if (user) {
        user.role = role.toLowerCase();
        return user
          .save()
          .then((user) => {
            return res.status(201).json({
              user: user,
            });
          })
          .catch((err) => {
            throw err;
          });
      }
      return res.status(404).json({
        msg: 'User not found!',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
