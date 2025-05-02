const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

// exports.createTransactionAndUpdateWallet = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         // 1. Create a transaction
//         const transaction = new Transaction(req.body);
//         await transaction.save({ session });

//         // 2. Update the wallet balance
//         const { fromUserId, appId, type, amount } = req.body;

//         const wallet = await Wallet.findOneAndUpdate(
//             { userId: fromUserId, appId },
//             { $inc: { [`wallets.${type}`]: amount } },
//             { new: true, session }  // Ensure the update uses the same session
//         );

//         if (!wallet) throw new Error('Wallet not found');

//         await session.commitTransaction();  // Commit the transaction
//         session.endSession();  // End the session

//         res.status(201).json({ transaction, wallet });
//     } catch (error) {
//         await session.abortTransaction();  // Abort the transaction on error
//         session.endSession();  // End the session
//         res.status(500).json({ message: error.message });
//     }
// };
exports.createTransactionAndUpdateWallet = async (req, res) => {
  try {
    const { fromUserId, appId, type, amount } = req.body;
    // console.log(">>>>", req.body);
    // console.log(">>>>", fromUserId);
    // return;
    let wallet = await Wallet.findOne({ userId: fromUserId, appId });
    console.log("wallet>>>>", wallet);

    // If wallet doesn't exist, create a new one
    if (!wallet) {
      const data = {
        userId: req.body.fromUserId,
        appId: req.body.appId,
        wallets: {},
      };
      // console.log('wallet>>>>', data);
      // return
      wallet = new Wallet(data);

      await wallet.save();
    }

    // Validate for insufficient funds if the transaction is a deduction
    const currentBalance = wallet.wallets.get(type) || 0;

    if (amount < 0 && Math.abs(amount) > currentBalance) {
      return res.send({
        status: 501,
        message: "Insufficient Amount in Wallet. Please recharge !!",
      });
    }
    // let walletAmount = wallet.wallets.get(type);

    // if (Math.abs(amount) > walletAmount) {
    //     return res.send({ status: 501, message: 'Insufficient fund in Wallet' })
    //     // throw new Error('Insufficient funds in the wallet');
    //     // throw createError.BadRequest('Insufficent Amount In Wallet')

    //     // return res.status(501).json({ status: 501, message: 'Insufficient funds in the wallet' });
    // }

    // Create a transaction
    const transaction = new Transaction(req.body);
    await transaction.save();

    // Update the wallet balance
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: fromUserId, appId },
      { $inc: { [`wallets.${type}`]: amount } },
      { new: true }
    );
    res.status(201).json({ transaction, wallet: updatedWallet });

    // console.log('wallet>>>>', updatedWallet);
    // return
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new transaction
exports.createTransactionForUser = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions for a user and appId
exports.getTransactionsByUserIdAndAppId = async (req, res) => {
  try {
    const { userId, appId, walletType } = req.params;
    // console.log('>>>>>>>>>>');
    // return
    // const transactions = await Transaction.find({ fromUserId: userId, appId, type: walletType })
    const transactions = await Transaction.find({
      fromUserId: userId,
      appId,
      type: walletType,
    }).sort({ createdAt: -1 });

    // console.log('>>>>>>>>>>', transactions);
    // return
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTransactionsByUserId = async (req, res) => {
  try {
    // console.log('>>>>>>>>>> 1 2 3 90');
    // return
    const { userId, orderId } = req.params;
    const transactions = await Transaction.find({
      fromUserId: userId,
      "metadata.orderId": orderId,
    }).sort({ createdAt: -1 });

    if (transactions.length === 0) {
      // throw new Error('No transactions found for the given userId and orderId');
      res.status(201).json({
        message: "No transactions found for the given userId and orderId",
      });
    }

    for (const transaction of transactions) {
      const transactionData = transaction.toObject();
      delete transactionData._id; // Explicitly remove _id

      const refundTransaction = new Transaction({
        ...transactionData,
        amount: Math.abs(transaction.amount),
        status: "Refund",
      });

      await refundTransaction.save();

      // Update the wallet balance
      const { fromUserId, appId, type, amount } = refundTransaction;
      await Wallet.findOneAndUpdate(
        { userId: fromUserId, appId },
        { $inc: { [`wallets.${type}`]: Math.abs(amount) } },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Refund transactions created successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { walletType } = req.params;
    // console.log(">>>>>>>>>>");
    // return;
    // const transactions = await Transaction.find({ fromUserId: userId, appId, type: walletType })
    const transactions = await Transaction.find({
      type: walletType,
    }).sort({ createdAt: -1 });

    // console.log(">>>>>>>>>>", transactions);
    // return;
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
