const express=require('express')
const app=express()
const userRouter=require('./routes/userRouter')
const bookingRouter=require('./routes/bookingRoutes')
const deskRouter=require('./routes/deskRoutes')
const cors=require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/user',userRouter)
app.use('/booking',bookingRouter)
app.use('/desk',deskRouter)
app.get('/',(req,res)=>{
    res.send("Hello");
})
module.exports=app