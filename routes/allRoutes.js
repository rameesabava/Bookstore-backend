const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const bookController = require('../controllers/bookController')
const adminMiddleware = require('../middlewares/adminMiddleware')

// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// google login
router.post('/google-login',userController.googleLoginController)

// home books
router.get('/home-books',bookController.getHomePageBookController)

// ----------------Authorised user - user-----------------------------------------
// user edit
router.put('/user/:id',authMiddleware, multerMiddleware.single('picture'), userController.userEditController)

// add book
router.post('/books',authMiddleware,multerMiddleware.array('uploadImages',3),bookController.addBookController)

// get BooksPage
router.get('/all-books',authMiddleware,bookController.getBooksPageController)

// get user upload books
router.get('/user-books',authMiddleware,bookController.getUserBooksController)

// get user bought books
router.get('/bought-books',authMiddleware,bookController.getUserBoughtBooksController)

// delete book
router.delete('/books/:id',authMiddleware,bookController.removeUserUploadBooksController)

// get single book to view
router.get('/books/:id',authMiddleware,bookController.getSingleBookViewController)

// book payment
router.put('/books/:id/buy',authMiddleware,bookController.bookPaymentController)

// -------------Authorised user - admin-------------

// admin profile edit
router.put('/profile/:id',adminMiddleware,multerMiddleware.single('picture'),userController.userEditController)

module.exports = router
