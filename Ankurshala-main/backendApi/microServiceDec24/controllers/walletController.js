const Wallet = require("../models/Wallet");

// Create a new wallet for a user and an appId
exports.createWalletForUser = async (req, res) => {
  try {
    const wallet = new Wallet(req.body);
    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a user's wallet balance for a specific appId
exports.getWalletByUserIdAndAppId = async (req, res) => {
  try {
    const { userId, appId } = req.params;
    const wallet = await Wallet.findOne({ userId, appId });
    // if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    if (!wallet) {
      const newWallet = new Wallet({
        userId,
        appId,
        wallets: {},
      });
      await newWallet.save();
      res.status(201).json(newWallet);
      return;
    }
    res.status(200).json(wallet);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add/update funds to a wallet type
exports.addFundsToWalletType = async (req, res) => {
  try {
    const { userId, appId, type } = req.params;
    const { amount } = req.body; // Assuming you send the amount to be added as request body

    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId, appId },
      { $inc: { [`wallets.${type}`]: amount } },
      { new: true }
    );

    if (!updatedWallet)
      return res.status(404).json({ message: "Wallet not found" });
    res.status(200).json(updatedWallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve the total wallet amount and breakdown for all users (Super Admin)
// exports.getAllWalletsSummary = async (req, res) => {
//   // console.log("wallet list>>>>>1112");
//   // return;
//   try {
//     const wallets = await Wallet.find({}); // Retrieve all wallets

//     // console.log("wallet list>>>>>1112", wallets);
//     // return;

//     res.status(200).json({
//       wallets,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getAllWalletsSummary = async (req, res) => {
  try {
    const wallets = await Wallet.find({}); // Retrieve all wallets

    // Initialize totals for wallet types
    const totals = {
      primary: 0,
    };

    // Iterate over the wallets and calculate totals
    wallets.forEach((wallet) => {
      const walletData = Object.fromEntries(wallet.wallets); // Convert Map to plain object

      if (walletData.primary) totals.primary += walletData.primary;
      // if (walletData.Logistic) totals.Logistic += walletData.Logistic;
      // if (walletData.Dcm_Wallet) totals.Dcm_Wallet += walletData.Dcm_Wallet;
      // if (walletData.Stl_Wallet) totals.Stl_Wallet += walletData.Stl_Wallet;
    });

    // Send the response with wallet data and totals in metaData
    res.status(200).json({
      wallets,
      metaData: {
        primaryWallet: totals.primary.toFixed(2),
        // totalLogisticWallet: totals.Logistic.toFixed(2),
        // totalDcmWallet: totals.Dcm_Wallet.toFixed(2),
        // totalStlWallet: totals.Stl_Wallet.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
