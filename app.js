const express = require('express')
const app = express()
const userRouter = require('./routes/userRouter')
const bookingRouter = require('./routes/bookingRoutes')
const propertyRouter = require('./routes/propertyRoutes')
const kycRouter = require('./routes/kycRoutes')
const notificationRouter = require('./routes/notificationRoutes')
const wishlistRouter = require('./routes/wishlistRoutes')
const authRouter = require('./routes/authRoutes')
const fcmRouter=require('./routes/fcmRoutes')
const cors = require('cors')
const admin=require('./config/firebase')
app.use(express.static('uploads'))
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/booking', bookingRouter)
app.use('/properties', propertyRouter)
app.use('/wishlist', wishlistRouter)
app.use('/kyc', kycRouter)
app.use('/fcm',fcmRouter)
app.use('/notification',notificationRouter)
app.get('/', (req, res) => {
  res.send('Hello')
})
app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body
  const message = {
    notification: {
      title,
      body,
    },
    token,
  }
  try {
    const response = await admin.messaging().send(message)
    res.json({ success: true, response })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
module.exports = app
