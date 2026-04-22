const users = require('../models/userModel')
const bcrypt = require('bcrypt')

// register
exports.registerController = async (req,res) =>{
    console.log("Inside registerController");
    console.log(req.body);
    const {username,email,password,role} = req.body
    // check email is in db
    const existingUser = await users.findOne({email})
    // if present, send response as please login
    if(existingUser){
        res.status(409).json("User Already Exists... Please Login!!!")
    }else{

    }
    
    
    
}