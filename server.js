require('dotenv').config()
const http=require('http')
const app=require('./app')
const server=http.createServer(app)
const {connectToMongo}=require('./services/db')
const PORT=process.env.PORT
const mongoURI="mongodb://localhost:27017/coworking" 
connectToMongo(mongoURI)
server.listen(PORT,()=>{
    console.log("Server is running");
})