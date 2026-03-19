const db = require("../config/db");
const { sendToOrchestrator } = require("../services/orchestratorService");

const {
  verifyPAN,
  sendAadhaarOTP,
  verifyAadhaarOTP,
} = require("../services/kycService");

exports.verifyPANController = async (req, res) => {
  try {
    const { application_id, pan, name, dob } = req.body;

    const response = await verifyPAN(pan, name, dob);

    if (response.data?.status !== "valid") {
      await db.query(
        `UPDATE applications 
       SET status='REJECTED', kyc_status='FAILED'
       WHERE application_id=$1`,
        [application_id],
      );

      return res.json({
        message: "PAN verification failed",
        application_status: "REJECTED",
      });
    }

    res.json(response);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.sendAadhaarOTPController = async (req, res) => {
  try {
    const { aadhaar } = req.body;

    const response = await sendAadhaarOTP(aadhaar);

    res.json(response);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.verifyAadhaarOTPController = async (req, res) => {
  try {
    const { application_id, reference_id, otp } = req.body;

    const result = await verifyAadhaarOTP(String(reference_id), String(otp));

    if (result.data?.status !== "VALID") {
      await db.query(
        `UPDATE applications 
  SET status='REJECTED',
      kyc_status='FAILED',
      reason='KYC verification failed'
  WHERE application_id=$1`,
        [application_id],
      );

      return res.json({
        message: "Aadhaar verification failed",
        application_status: "REJECTED",
      });
    }

    // KYC SUCCESS
    await db.query(
      `UPDATE applications 
    SET kyc_status='VERIFIED', status='PROCESSING'
    WHERE application_id=$1`,
      [application_id],
    );

    // Trigger orchestrator
    const orchestratorResult = await sendToOrchestrator(application_id);

    res.json({
      message: "KYC successful",
      orchestrator: orchestratorResult,
    });
  } catch (error) {
    res.status(500).json(error.response?.data || error);
  }
};
