const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPE_SK);
const { GoogleGenerativeAI } = require('@google/generative-ai')

// add book
exports.addBookController = async (req, res) => {
    console.log("Inside addBookController");
    // get book details from req body
    const { title, author, pages, imageURL, price, discountPrice, abstract, publisher, isbn, language, category } = req.body
    const uploadImages = req.files.map(item => item.filename)
    const sellerMail = req.payload
    console.log(title, author, pages, imageURL, price, discountPrice, abstract, publisher, isbn, language, category, uploadImages, sellerMail);
    // check book existing
    const existingBook = await books.findOne({ title, sellerMail })
    // if book is already exist: send response as denied
    if (existingBook) {
        res.status(409).json("Book already exists...Operation Denied!!!")
    } else {
        // else : add book to db, send success res to client
        const newBook = await books.create({
            title, author, pages, imageURL, price, discountPrice, abstract, publisher, isbn, language, category, uploadImages, sellerMail
        })
        res.status(201).json(newBook)
    }
}

// get latest books: get 4 latest books
exports.getHomePageBookController = async (req, res) => {
    console.log("Inside getHomePageBookController");
    const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
    res.status(200).json(homeBooks)

}

// get all books apart from login user: display all books ignoring logined user
exports.getBooksPageController = async (req, res) => {
    console.log("Inside getBooksPageController");
    const loginUserMail = req.payload
    const searchKey = req.query.search
    const allBooks = await books.find({ sellerMail: { $ne: loginUserMail }, title: { $regex: searchKey, $options: "i" } })
    res.status(200).json(allBooks)
}

// get user profile books : display books uploaded by logined user
exports.getUserBooksController = async (req, res) => {
    console.log("Inside getUserBooksController");
    const loginUserMail = req.payload
    const userUploadBooks = await books.find({ sellerMail: loginUserMail })
    res.status(200).json(userUploadBooks)
}

// get user bought books : display books bought by logined user
exports.getUserBoughtBooksController = async (req, res) => {
    console.log("Inside getUserBoughtBooksController");
    const loginUserMail = req.payload
    const userBoughtBooks = await books.find({ buyerMail: loginUserMail })
    res.status(200).json(userBoughtBooks)
}
// remove book by a user: logined user can delete uploaded book
exports.removeUserUploadBooksController = async (req, res) => {
    console.log("Inside removeUserUploadBooksController");
    const loginUserMail = req.payload
    const { id } = req.params
    const removeBook = await books.findByIdAndDelete({ _id: id })
    res.status(200).json(removeBook)
}

// get single book to view
exports.getSingleBookViewController = async (req, res) => {
    console.log("Inside getSingleBookViewController");
    const { id } = req.params
    const book = await books.findById({ _id: id })
    res.status(200).json(book)
}

// get all books: at admin resource page
exports.getAllBooksController = async (req, res) => {
    console.log("Inside getAllBooksController");
    const allBooks = await books.find()
    res.status(200).json(allBooks)
}

// update book status: at admin part
exports.updateBookStatusController = async (req, res) => {
    console.log("Inside updateBookStatusController");
    const { id } = req.params
    const bookDetails = await books.findById({ _id: id })
    bookDetails.status = "approved"
    await bookDetails.save()
    res.status(200).json(bookDetails)
}

// book payment
exports.bookPaymentController = async (req, res) => {
    console.log("Inside bookPaymentController");
    const buyerMail = req.payload
    const { id } = req.params
    const bookDetails = await books.findById({ _id: id })
    bookDetails.status = "sold"
    bookDetails.buyerMail = buyerMail
    // create stripe checkout session
    const line_items = [{
        price_data: {
            currency: 'usd',
            product_data: {
                name: bookDetails.title,
                description: `${bookDetails.author},${bookDetails.publisher}`,
                images: bookDetails.uploadImages,
                metadata: {
                    title: bookDetails.title,
                    author: bookDetails.author,
                    price: bookDetails.discountPrice
                }
            },
            unit_amount: Math.round(bookDetails.discountPrice * 100)
        },
        quantity: 1
    }]

    const session = await stripe.checkout.sessions.create({
        success_url: 'https://bookstore-sigma-woad-41.vercel.app/success',
        cancel_url: 'https://bookstore-sigma-woad-41.vercel.app/cancel',
        line_items,
        mode: 'payment',
        payment_method_types: ['card']
    });
    console.log(session);
    session.url && await bookDetails.save()

    res.status(200).json({ checkOutURL: session.url })

}

// get book content using gemini api
exports.generateBookDetailsAIController = async (req,res)=>{
    console.log("Inside generateBookDetailsAIController");
    
    const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API)
    const {title} = req.body
    const model = genAI.getGenerativeModel({
        model:"gemini-2.5-flash"
    })
    const result = await model.generateContent(`Give me a short abstract of the book ${title}`)
    const reply = result.response
    console.log(reply);
    
    res.status(200).json({
        success:true,
        user:title,
        content:reply.candidates[0].content.parts[0].text
    })
    
}