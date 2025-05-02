const mongoose = require('mongoose')

// Database Setup
const fs = require('fs');

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // sslCA: certFileBuf,
    // useFindAndModify: false,
    useUnifiedTopology: true,
    // poolSize: 100,
    // retry to connect for 60 times
    // reconnectTries: 60,
    // wait 1 second before retrying
    // allowDiskUse: true,
	  // reconnectInterval: 1000
  })
  .then(() => {
    console.log('mongodb connected.')
  })
  .catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db', `${process.env.DB_NAME}`)
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
