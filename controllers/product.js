var async = require('async');
const fs = require('fs');
const Product = require('../models/product');

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((result) => {
      res.send({ products: result });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.saveProductsFromFile = (req, res, next) => {
  fs.readFile('products.json', 'utf8', function (err, data) {
    if (err) throw err;

    Product.insertMany([...JSON.parse(data)])
      .then((result) => {
        res.send({ products: result });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  });
};

exports.getProductById = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then((result) => {
      console.log(result);
      return res.send({ product: result });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.newProduct = (req, res, next) => {
  const { section, price, title, salePrice, categories, img, details, keyword } =
    req.body;
  const product = new Product({
    section,
    price,
    title,
    salePrice,
    categories,
    img,
    details,
    keyword
  });
  product
    .save()
    .then((result) => {
      console.log(result._id)
      stripe.products
        .create({
          id: result._id.toString(),
          name: title,
          images: [img],
          description: 'description'
        })
        .then((stProd) => {
          stripe.prices
            .create({
            
              product: stProd.id,
              unit_amount: salePrice ? salePrice*100 : price*100,
              currency: 'usd',
            })
            .then((savedProd) => {
              console.log(savedProd);
              res.send({ product: result });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.editProduct = (req, res, next) => {
  const { section, price, title, salePrice, categories, img, details, id, keyword } =
    req.body;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          msg: 'Product not found!',
        });
      }

      product.section = section;
      product.price = price;
      product.title = title;
      product.salePrice = salePrice;
      product.categories = categories;
      product.img = img;
      product.details = details;
      product.keyword = keyword;

      return product.save();
    })
    .then((result) => {
      res.send({ product: result });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.arrangeProducts = (req, res, next) => {
  const { order } = req.body;
  let ids = Object.keys(order);

  Product.find({ _id: { $in: ids } }).then((prods) => {
    // prods.forEach((prod) => {

    // });

    async.each(
      prods,
      (prod, callback) => {
        prod.index = order[prod._id];
        prod.save(callback);
      },
      (result) => {
        return res.json({ msg: 'Arraged!' });
      }
    );
  });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((result) => {
      res.status(200).json({
        msg: 'Successfully Deleted',
      });
    })
    .catch((err) => {
      throw err;
    });
};
