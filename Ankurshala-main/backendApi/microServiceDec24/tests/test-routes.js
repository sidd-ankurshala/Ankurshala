const axios = require("axios");

const baseURL = "http://localhost:3030/api";

const headers = {
  "Content-Type": "application/json",
};

// Test creating a new wallet
const testCreateWallet = async () => {
  const data = {
    userId: "sampleUserId3",
    appId: "ankurshala",
    wallets: {},
  };

  try {
    const response = await axios.post(`${baseURL}/wallets`, data, { headers });
    console.log("Wallet created:", response.data);
  } catch (error) {
    console.error("Error creating wallet:", error.response.data);
  }
};

// Test getting a wallet by userId and appId
const testGetWallet = async (userId, appId) => {
  try {
    const response = await axios.get(`${baseURL}/wallets/${userId}/${appId}`, {
      headers,
    });
    console.log("Wallet retrieved:", response.data);
  } catch (error) {
    console.error("Error retrieving wallet:", error.response.data);
  }
};

// Test adding funds to a wallet type
const testAddFunds = async (userId, appId, type, amount) => {
  try {
    const response = await axios.put(
      `${baseURL}/wallets/${userId}/${appId}/${type}`,
      { amount },
      { headers }
    );
    console.log("Wallet updated:", response.data);
  } catch (error) {
    console.error("Error adding funds:", error.response.data);
  }
};

// Test creating a new transaction and updating the wallet
const testCreateTransactionAndUpdateWallet = async (transactionData) => {
  try {
    const response = await axios.post(
      `${baseURL}/transactions/createAndUpdateWallet`,
      transactionData,
      { headers }
    );
    console.log("Transaction created and Wallet updated:", response.data);
  } catch (error) {
    console.error(
      "Error in transaction and wallet update:",
      error.response.data
    );
  }
};

// Test getting transactions by userId and appId
const testGetTransactions = async (userId, appId) => {
  try {
    const response = await axios.get(
      `${baseURL}/transactions/${userId}/${appId}`,
      { headers }
    );
    console.log("Transactions retrieved:", response.data);
  } catch (error) {
    console.error("Error retrieving transactions:", error.response.data);
  }
};

// Execute the tests
const runTests = async () => {
  await testCreateWallet();
  await testGetWallet("sampleUserId3", "ankurshala");
  await testAddFunds("sampleUserId1", "ankurshala", "Service", 100);
  await testCreateTransactionAndUpdateWallet({
    fromUserId: "sampleUserId3",
    appId: "ankurshala",
    type: "Service",
    amount: -50,
  });
  await testGetTransactions("sampleUserId3", "ankurshala");
};

runTests();
