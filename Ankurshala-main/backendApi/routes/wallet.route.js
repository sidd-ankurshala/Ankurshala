const router = require("express").Router();
const Controller = require("../controllers/wallet.controller");
const { verifyAccessToken } = require("../Helpers/jwt_helper");

// router.get('/invoice/:id', Controller.generateProformaInvoice)

// router.get('/wallets', verifyAccessToken, Controller.getWallets)

// router.get('/:id', verifyAccessToken, Controller.get)

router.get("/", verifyAccessToken, Controller.list);
router.get("/getWalletSummary", verifyAccessToken, Controller.list2);
router.get(
  "/transaction/:WalletType",
  verifyAccessToken,
  Controller.getTransaction
);
router.post("/", verifyAccessToken, Controller.create);
router.put("/:id", verifyAccessToken, Controller.create);
router.put("/dicom/:id", verifyAccessToken, Controller.dicomFile);
router.put("/processedStl/:id", verifyAccessToken, Controller.processedStl);

module.exports = router;
