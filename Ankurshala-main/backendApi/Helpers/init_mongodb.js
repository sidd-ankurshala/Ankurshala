const mongoose = require('mongoose');
const debug = require('debug')(`${process.env.DEBUG}:mongodb`);

// Ensure MONGO_URI is correctly set for Docker connection to local MongoDB
const MONGO_URI = process.env.MONGODB_URI ;
const DB_NAME = process.env.DB_NAME ;

mongoose
  .connect(MONGO_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true, // Helps avoid deprecation warnings
  })
  .then(() => {
    debug(`✅ MongoDB connected to database: ${DB_NAME}`);
  })
  .catch((err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

mongoose.connection.on('connected', () => {
  debug(`🔗 Mongoose connected to ${DB_NAME}`);
});

mongoose.connection.on('error', (err) => {
  debug(`❗ Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  debug('⚠️ Mongoose connection is disconnected.');
});

// Gracefully close MongoDB connection on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  debug('🛑 Mongoose connection closed due to app termination.');
  process.exit(0);
});
