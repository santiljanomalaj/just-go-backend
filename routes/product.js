const express = require('express');

const productController  = require('../controllers/product')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.get('/get-products', productController.getProducts)
router.post('/add-product', productController.newProduct)
router.get('/get-products/:id', productController.getProductById)
router.post('/update-product', productController.editProduct)
router.post('/arrange-products', productController.arrangeProducts)


router.delete('/delete-product/:id', productController.deleteProduct)

// router.get('/save-products', productController.saveProductsFromFile)


 





module.exports = router
