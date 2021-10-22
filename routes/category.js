const express = require('express');

const categoryController  = require('../controllers/category')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.get('/get-categories', categoryController.getCategories)
router.post('/update-category',isAuth, categoryController.editCategory)
router.post('/add-category', isAuth, categoryController.addCategory)
router.delete('/delete-category/:id', isAuth, categoryController.deleteCategory)
// router.post('/save-products', isAuth, categoryController.saveProducts)







module.exports = router
