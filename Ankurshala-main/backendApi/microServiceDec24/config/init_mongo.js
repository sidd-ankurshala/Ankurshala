const mongoose = require("mongoose");

// Use native ES6 promises
mongoose.Promise = global.Promise;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/AnkurshalaWallet";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      "Failed to connect to mongo on startup - retrying in 5 sec",
      error
    );
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// When the connection is connected
mongoose.connection.on("connected", () => {
  console.log("Mongoose default connection open to " + MONGODB_URI);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => {
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during disconnection", err);
      process.exit(1);
    });
});

module.exports = mongoose; // You can require this module wherever you need mongoose in your app
