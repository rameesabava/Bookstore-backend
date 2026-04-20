// register
exports.registerController = async (req,res) =>{
    console.log("Inside registerController");
    console.log(req.body);
    
    res.status(201).json("Register request received")
    
}