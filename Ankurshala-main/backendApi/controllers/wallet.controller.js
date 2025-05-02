const {
  postToWallet,
  getFromWallet,
} = require("./../Helpers/helper_functions");
const mongoose = require("mongoose");
const userModel = require("../models/user.model");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { id, amount } = req.body;

      // console.log("?>?>?>?>?>", req.body);
      // return;

      const postWallet = await postToWallet(
        "transactions/createAndUpdateWallet",
        {
          fromUserId: req.user._id,
          appId: "ankurshala",
          type: "primary",
          status: "Success",
          amount: amount,
          metadata: {
            orderId: id,
            orderType: "topic",
            fees: 0,
            taxValue: 0,
          },
        }
      );
      // return;
      res.json(postWallet.data);
      // console.log('transaction>>>>>', postWallet);
    } catch (error) {
      next(error);
    }
  },
  dicomFile: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await orderModel.findOne({
        _id: mongoose.Types.ObjectId(id),
      });

      const amt = parseFloat(process.env.DIACOM_DOWNLOAD_CHARGES_AMOUNT);

      const tax = -parseFloat(amt * 0.18);
      const fee = -(amt + tax);

      const postWallet = await postToWallet(
        "transactions/createAndUpdateWallet",
        {
          fromUserId: req.user._id,
          appId: "mydentalabs",
          type: "Dcm_Wallet",
          status: "Success",
          amount: process.env.DIACOM_DOWNLOAD_CHARGES_AMOUNT,
          metadata: {
            orderId: id,
            orderType: order.orderFormType,
            fees: fee,
            taxValue: tax,
          },
        }
      );
      res.json(postWallet.data);
      // console.log('transaction>>>>>', postWallet);
    } catch (error) {
      next(error);
    }
  },
  processedStl: async (req, res, next) => {
    try {
      const { id } = req.params;

      const amt = parseFloat(
        process.env.PROCESSED_CAD_STL_FILE_DOWNLOAD_CHARGE
      );

      const tax = -parseFloat(amt * 0.18);
      const fee = -(amt + tax);
      //  console.log('hellooo',tax);
      //  console.log('hellooo2',fee);
      // return

      const postWallet = await postToWallet(
        "transactions/createAndUpdateWallet",
        {
          fromUserId: req.user._id,
          appId: "mydentalabs",
          type: "Stl_Wallet",
          status: "Success",
          amount: process.env.PROCESSED_CAD_STL_FILE_DOWNLOAD_CHARGE,
          metadata: { orderId: id, fees: fee, taxValue: tax },
        }
      );
      res.json(postWallet.data);
    } catch (error) {
      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const userId = req.user.id;
      console.log("wallet list>>>>>", userId);
      return;
      const wallet = await getFromWallet(`wallets/${userId}/mydentalabs`);
      // console.log('>>>', wallet.data);
      // return
      res.json(wallet.data);
      return;
    } catch (error) {
      next(error);
    }
  },
  list2: async (req, res, next) => {
    try {
      // Fetch wallet data
      const wallet = await getFromWallet(`wallets/getWalletSummary`);
      const data = wallet.data;

      // Extract user IDs from wallets
      const userIds = data.wallets.map((o) => o.userId);

      // Fetch user details for the extracted user IDs
      const users = await userModel.aggregate([
        {
          $match: {
            _id: { $in: userIds.map((id) => mongoose.Types.ObjectId(id)) },
          },
        },
        { $project: { _id: 1, full_name: 1 } }, // Fetch only necessary fields
      ]);

      // Create a map for quick userName lookup
      const userMap = users.reduce((map, user) => {
        map[user._id.toString()] = user.full_name;
        return map;
      }, {});

      // Enhance wallets with userName
      const enhancedWallets = data.wallets.map((wallet) => ({
        ...wallet,
        userName: userMap[wallet.userId] || null, // Add userName or null if not found
      }));

      // Send the response
      res.json({ wallets: enhancedWallets, metaData: data.metaData });
    } catch (error) {
      // Handle errors
      next(error);
    }
  },
  // list2: async (req, res, next) => {
  //   try {
  //     const wallet = await getFromWallet(`wallets/getWalletSummary`);
  //     const data = wallet.data;
  //     // console.log(">>>>", wallet);
  //     // return;

  //     // Extract all userIds from the wallets
  //     const userIds = data.wallets.map((o) => o.userId);

  //     // Use aggregation to fetch user data for the relevant userIds
  //     const users = await userModel.aggregate([
  //       {
  //         $match: {
  //           _id: { $in: userIds.map((id) => mongoose.Types.ObjectId(id)) },
  //         },
  //       },
  //       { $project: { _id: 1, full_name: 1 } }, // Only fetch _id and name fields
  //     ]);

  //     // Create a map for quick lookup
  //     const userMap = users.reduce((map, user) => {
  //       map[user._id.toString()] = user.full_name;
  //       return map;
  //     }, {});

  //     // Enhance wallets by adding userName
  //     const enhancedWallets = data.wallets.map((o) => ({
  //       ...o,
  //       userName: userMap[o.userId] || null, // Add userName or null if not found
  //     }));

  //     res.json({ wallets: enhancedWallets, metaData: data.metaData });
  //     return;
  //   } catch (error) {
  //     next(error);
  //   }
  // },
  getTransaction: async (req, res, next) => {
    try {
      const { WalletType } = req.params;
      // console.log(">>>>|||", WalletType);
      // return;
      const userId = req.user.id;

      const transaction = await getFromWallet(`transactions/all/${WalletType}`);
      // console.log(">>>>|||>12", transaction.data);
      // return;
      const type = transaction.data;
      // console.log('transaction history', transaction.data);
      res.json(transaction.data);

      return;
    } catch (error) {
      next(error);
    }
  },
};
