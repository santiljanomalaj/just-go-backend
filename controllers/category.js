const Category = require("../models/category");
var fs = require("fs");

exports.getCategories = (req, res, next) => {
  Category.find()
    .sort({ orderNumber: 1 })
    .then((result) => {
      res.status(200).json({
        categories: result,
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.addCategory = (req, res, next) => {
  const name = req.body.name;
  const bg = req.body.bg;
  const imgUrl = req.body.icon;
  
  Category.countDocuments({}, function(err, count) {
    const category = new Category({ name: name, bg, icon: imgUrl, orderNumber: count + 1 });
    
    category
      .save()
      .then((result) => {
        return res.status(200).json({
          category: result,
        });
      })
      .catch((err) => {
        throw err;
      });
  })
};

exports.editCategory = (req, res, next) => {
  const name = req.body.name;
  const bg = req.body.bg;
  const imgUrl = req.body.icon;
  const id = req.body.id;
  const orderNumber = parseInt(req.body.orderNumber);

  Category.findOne({ orderNumber: orderNumber })
    .then((cate) => {
      if (cate) {
        Category.findById(id)
          .then((category) => {
            category.name = name;
            category.bg = bg;
            category.icon = imgUrl;
            cate.orderNumber = category.orderNumber;
            cate.save();
            category.orderNumber = orderNumber;
            return category.save();
          })
          .then((result) => {
            res.status(200).json({
              category: result,
            });
          })
          .catch((err) => {
            throw err;
          });
      }
    })
    .catch((error) => {
      throw error;
    })
};

exports.deleteCategory = (req, res, next) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({
        msg: "Successfully Deleted",
      });
    })
    .catch((err) => {
      throw err;
    });
};

exports.saveProducts = (req, res, next) => {
  const products = req.body.products;

  console.log(products.length);
  console.log("Saved");
  return res.json({});
};
