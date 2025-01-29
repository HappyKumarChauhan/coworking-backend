const mongoose = require('mongoose')
const connectToMongo = async (URI) => {
  try {
    await mongoose.connect(URI)
    console.log('Connected to MongoDB successfully!')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1) // Exit the process with failure if the connection fails.
  }
  // Handle disconnection errors
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB connection lost. Reconnecting...')
    connectToMongo() // Optional: Reconnect logic
  })

  // Optional: Log successful reconnection
  mongoose.connection.on('connected', () => {
    console.log('MongoDB reconnected successfully.')
  })
}
module.exports = {
  connectToMongo,
}
