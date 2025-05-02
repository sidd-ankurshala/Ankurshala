const express = require("express");
const authenticate = require("./middlewares/authenticate");
const walletController = require("./controllers/walletController");
const transactionController = require("./controllers/transactionController");

require("./config/init_mongo");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(authenticate.validateHeaders)

// Wallet routes
app.post("/api/wallets", walletController.createWalletForUser);
app.get(
  "/api/wallets/:userId/:appId",
  walletController.getWalletByUserIdAndAppId
);
app.put(
  "/api/wallets/:userId/:appId/:type",
  walletController.addFundsToWalletType
);
app.get("/api/wallets/getWalletSummary", walletController.getAllWalletsSummary);

// Transaction routes
app.post("/api/transactions", transactionController.createTransactionForUser);
app.post(
  "/api/transactions/createAndUpdateWallet",
  transactionController.createTransactionAndUpdateWallet
);
app.get(
  "/api/transactions/:userId/:appId/:walletType",
  transactionController.getTransactionsByUserIdAndAppId
);
app.get(
  "/api/transactions/all/:walletType",
  transactionController.getAllTransactions
);
app.get(
  "/api/transactions/:userId/:orderId",
  transactionController.getAllTransactionsByUserId
);

app.listen(PORT, () => {
  console.log(`Wallet microservice running on port ${PORT}`);
});
