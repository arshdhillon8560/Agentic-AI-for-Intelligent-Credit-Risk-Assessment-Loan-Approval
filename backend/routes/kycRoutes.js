const express = require("express")

const router = express.Router()

const kycController = require("../controllers/kycController")

router.post("/verify-pan",kycController.verifyPANController)

router.post("/aadhaar/send-otp",kycController.sendAadhaarOTPController)

router.post("/aadhaar/verify-otp",kycController.verifyAadhaarOTPController)

module.exports = router