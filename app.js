const express=require('express')
const app=express()
const userRouter=require('./routes/userRouter')
const cors=require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/user',userRouter)
app.get('/',(req,res)=>{
    res.send("Hello");
})
module.exports=app