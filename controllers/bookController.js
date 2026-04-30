const books = require('../models/bookModel')

// add book
exports.addBookController = async (req, res) => {
    console.log("Inside addBookController");
    // get book details from req body
    const { title, author, pages, imageURL, price, discountPrice, abstract, publisher, isbn, language, category } = req.body
    const uploadImages = req.files.map(item => item.filename)
    const sellerMail = req.payload
    console.log(title, author, pages, imageURL, price, discountPrice, abstract, publisher, isbn, language, category, uploadImages, sellerMail);
    // check book existing
    const existingBook = await books.findOne(title, sellerMail)
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

// get all user uploaded books: display all books ignoring logined user

// get user profile books : display books uploaded by logined user

// get user bought books : display books bought by logined user

// remove book by a user: logined user can delete uploaded book

// get single book to view

// get all books: at admin resource page

// update book status: at admin part

// book payment
