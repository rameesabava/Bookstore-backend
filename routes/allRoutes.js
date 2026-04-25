const express = require('express')
const userController = require('../controllers/userController')

// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

// register
router.post('/register',userController.registerController)
// login
router.post('/login',userController.loginController)

// google login
router.post('/google-login',userController.googleLoginController)

module.exports = router