const express=require('express')
const port=3000;
const app=express()
const {connectToMongo}=require('./services/db')
const mongoURI="mongodb+srv://happychauhan:Happy%23203@app0.w86uy.mongodb.net/App0"
const userRouter=require('./routes/userRouter')
connectToMongo(mongoURI).then(()=>{
    console.log("Mongodb connected successfully.")
})
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/users',userRouter)
app.get('/',(req,res)=>{
    res.send("Hello");
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})