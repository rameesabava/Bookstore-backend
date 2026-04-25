const mongoose = require('mongoose')
const connectionString = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("Database connection successful");
    
}).catch(error=>{
    console.log("Database connection failed!!!");
    console.log(error);
  })