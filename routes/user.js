const express = require('express');

const userController  = require('../controllers/user')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.post('/save-user',isAuth, userController.saveUser)
router.get('/get-user',isAuth, userController.getUser)
router.get('/get-users',isAuth, userController.getUsers)
router.put('/change-role',isAuth, userController.changeRole)





module.exports = router
