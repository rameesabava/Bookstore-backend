const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    console.log("Inside Authentication Middleware");
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token);
    if(token){
        try{
            const jwtresponse = jwt.verify(token,process.env.JWTSECRET)
            console.log(jwtresponse);
            req.payload = jwtresponse.userMail
            next()
            
        }catch(err){
            res.status(401).json("Invalid Token... Please Login!!!")
        }
    }else{
            res.status(401).json("Authorization failed...Token Missing!!!!")
    }
    
    
}

module.exports = authMiddleware