const express = require('express');

const sectionController  = require('../controllers/section')
const isAuth = require('../middleware/isAuth')
const router = express.Router();

router.get('/get-sections', sectionController.getSections)
router.post('/update-section',isAuth, sectionController.editSection)
router.post('/add-section', isAuth, sectionController.addsection)
router.delete('/delete-section/:id', isAuth, sectionController.deleteSection)







module.exports = router
