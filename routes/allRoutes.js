const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const bookController = require('../controllers/bookController')

// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// google login
router.post('/google-login',userController.googleLoginController)

// user edit
router.put('/user/:id',authMiddleware, multerMiddleware.single('picture'), userController.userEditController)

// add book
router.post('/books',authMiddleware,multerMiddleware.array('uploadImages'),bookController.addBookController)

module.exports = router
