const axios = require("axios")

const API_KEY = process.env.SANDBOX_API_KEY
const API_SECRET = process.env.SANDBOX_API_SECRET

// TEST ENVIRONMENT URL
const BASE_URL = "https://api.sandbox.co.in"

let accessToken = null


// Generate token
async function generateToken(){

    const response = await axios.post(
        `${BASE_URL}/authenticate`,
        {},
        {
            headers:{
                "x-api-key": API_KEY,
                "x-api-secret": API_SECRET,
                "x-api-version": "1.0",
                "Content-Type":"application/json"
            }
        }
    )

    accessToken = response.data.data.access_token

    return accessToken
}



// PAN Verification
async function verifyPAN(pan,name,dob){

    if(!accessToken){
        await generateToken()
    }

    const response = await axios.post(
        `${BASE_URL}/kyc/pan/verify`,
        {
            "@entity":"in.co.sandbox.kyc.pan_verification.request",
            pan: pan,
            name_as_per_pan: name,
            date_of_birth: dob,   // must be DD/MM/YYYY
            consent:"Y",
            reason:"Loan Approval KYC"
        },
        {
            headers:{
                "x-api-key":API_KEY,
                "authorization":accessToken,
                "Content-Type":"application/json"
            }
        }
    )

    return response.data
}



// Aadhaar OTP
async function sendAadhaarOTP(aadhaar){

    if(!accessToken){
        await generateToken()
    }

    const response = await axios.post(
        `${BASE_URL}/kyc/aadhaar/okyc/otp`,
        {
            "@entity":"in.co.sandbox.kyc.aadhaar.okyc.otp.request",
            aadhaar_number:aadhaar,
            consent:"Y",
            reason:"Loan Approval KYC"
        },
        {
            headers:{
                "Authorization":accessToken,
                "x-api-key":API_KEY,
                "x-api-version":"1.0",
                "Content-Type":"application/json"
            }
        }
    )

    return response.data
}


// Aadhaar OTP Verify
async function verifyAadhaarOTP(reference_id, otp){

    if(!accessToken){
        await generateToken()
    }

    const response = await axios.post(
        `${BASE_URL}/kyc/aadhaar/okyc/otp/verify`,
        {
            "@entity":"in.co.sandbox.kyc.aadhaar.okyc.request",
            reference_id: String(reference_id),   // FIX
            otp: String(otp)
        },
        {
            headers:{
                "Authorization": accessToken,
                "x-api-key": API_KEY,
                "x-api-version": "1.0",
                "Content-Type": "application/json"
            }
        }
    )

    return response.data
}


module.exports = {
  verifyPAN,
  sendAadhaarOTP,
  verifyAadhaarOTP
}