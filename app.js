const express=require('express')
const app=express()
const userRouter=require('./routes/userRouter')
const bookingRouter=require('./routes/bookingRoutes')
const propertyRouter=require('./routes/propertyRoutes')
const kycRouter=require('./routes/kycRoutes')
const notificationRouter=require('./routes/notificationRoutes')
const cors=require('cors')
app.use(express.static('uploads'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/user',userRouter)
app.use('/booking',bookingRouter)
app.use('/properties',propertyRouter)
app.use('/kyc',kycRouter)
app.get('/',(req,res)=>{
    res.send("Hello");
})
module.exports=app