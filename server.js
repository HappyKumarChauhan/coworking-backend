const http=require('http')
const app=require('./app')
const server=http.createServer(app)
const {connectToMongo}=require('./services/db')
require('dotenv').config()
const PORT=process.env.PORT
const mongoURI=process.env.MONGO_URI 
connectToMongo(mongoURI)
server.listen(PORT,()=>{
    console.log("Server is running");
})