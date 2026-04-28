// import all packages
// loads .env file contents into process.env by default
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/allRoutes')
require('./config/db')

// create server using express package
const server = express()
// enable cors in server
server.use(cors())
// parse json to js content
server.use(express.json())
// use routes in server
server.use(routes)
// handling static file/folder
server.use('/uploads',express.static('./uploads'))
// Setup a port number to run server in internet
const PORT = process.env.PORT
// start server to listen client request
server.listen(PORT, () => {
    console.log("Server started and waiting for client request");

})

// handling global errors in server using application specific middleware
server.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})

// resolve API using express
server.get('/', (req, res) => {
    res.status(200).send(`<h1>Server started and waiting for client request</h1>`)
})

