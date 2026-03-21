const db = require("../config/db")
const generateApplicationId = require("../utils/generateApplicationId")
const { sendToOrchestrator } = require("../services/orchestratorService")
const multer = require("multer")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")

const upload = require("../middleware/uploadMiddleware")


exports.uploadMiddleware = upload.fields([
 { name: "bank_statement" },
 { name: "salary_slip" },
 { name: "itr_document" }
])





exports.createApplication = async (req, res) => {

 try {

  console.log("BODY:", req.body)
  console.log("USER:", req.user)

  const userId = req.user?.id

  const { loan_amount, loan_tenure, loan_purpose } = req.body

  if (!loan_amount || !loan_tenure || !loan_purpose) {
   return res.status(400).json({
    message: "loan_amount, loan_tenure and loan_purpose required"
   })
  }

  const applicationId = generateApplicationId()

  await db.query(
   `INSERT INTO applications
   (application_id,user_id,loan_amount,loan_tenure,loan_purpose)
   VALUES($1,$2,$3,$4,$5)`,
   [applicationId, userId, loan_amount, loan_tenure, loan_purpose]
  )

  res.json({
   message: "Application created successfully",
   application_id: applicationId
  })

 } catch (error) {

  console.error("CREATE APPLICATION ERROR:", error)

  res.status(500).json({
   error: error.message
  })

 }

}


exports.saveApplicantProfile = async (req, res) => {

 try {

  const {
   application_id,
   name,
   age,
   date_of_birth,
   gender,
   marital_status,
   pan_number,
   aadhaar_number,
   address,
   city,
   state,
   pincode
  } = req.body

  await db.query(
   `INSERT INTO applicant_profiles
   (application_id,name,age,date_of_birth,gender,marital_status,
   pan_number,aadhaar_number,address,city,state,pincode)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
   [
    application_id,
    name,
    age,
    date_of_birth,
    gender,
    marital_status,
    pan_number,
    aadhaar_number,
    address,
    city,
    state,
    pincode
   ]
  )

  res.json({ message: "Applicant profile saved successfully" })

 } catch (error) {

  res.status(500).json(error)

 }

}



exports.saveEmployment = async (req, res) => {

 try {

  const {
   application_id,
   employment_type,
   employer_name,
   industry,
   job_title,
   years_in_current_job,
   total_work_experience,
   monthly_income,
   salary_mode
  } = req.body

  await db.query(
   `INSERT INTO employment_details
   (application_id,employment_type,employer_name,industry,
   job_title,years_in_current_job,total_work_experience,
   monthly_income,salary_mode)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
   [
    application_id,
    employment_type,
    employer_name,
    industry,
    job_title,
    years_in_current_job,
    total_work_experience,
    monthly_income,
    salary_mode
   ]
  )

  res.json({ message: "Employment details saved successfully" })

 }
 catch (error) {

  res.status(500).json(error)

 }

}



exports.saveFinancial = async (req, res) => {

 try {

  const {
   application_id,
   existing_loans,
   existing_emi,
   credit_card_limit,
   credit_card_balance,
   bank_name,
   bank_account_type,
   bank_account_number,
   average_monthly_balance
  } = req.body

  await db.query(
   `INSERT INTO financial_details
   (application_id,existing_loans,existing_emi,
   credit_card_limit,credit_card_balance,
   bank_name,bank_account_type,bank_account_number,
   average_monthly_balance)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
   [
    application_id,
    existing_loans,
    existing_emi,
    credit_card_limit,
    credit_card_balance,
    bank_name,
    bank_account_type,
    bank_account_number,
    average_monthly_balance
   ]
  )

  res.json({ message: "Financial details saved successfully" })

 }
 catch (error) {

  res.status(500).json(error)

 }

}



const uploadToCloudinary = (fileBuffer) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "loan_documents"
      },
      (error, result) => {

        if (error) {
          console.error("Cloudinary Upload Error:", error)
          reject(error)
        } else {
          resolve(result)
        }

      }
    )

    streamifier.createReadStream(fileBuffer).pipe(stream)

  })

}

exports.uploadDocuments = async (req, res) => {

  try {

    const { application_id } = req.body

    const bankFile = req.files.bank_statement[0]
    const salaryFile = req.files.salary_slip[0]
    const itrFile = req.files.itr_document[0]

    const bankUpload = await uploadToCloudinary(bankFile.buffer)
    const salaryUpload = await uploadToCloudinary(salaryFile.buffer)
    const itrUpload = await uploadToCloudinary(itrFile.buffer)

    const bankUrl = bankUpload.secure_url
    const salaryUrl = salaryUpload.secure_url
    const itrUrl = itrUpload.secure_url

    await db.query(
      `INSERT INTO documents
       (application_id,bank_statement_url,salary_slip_url,itr_document_url)
       VALUES ($1,$2,$3,$4)`,
      [application_id, bankUrl, salaryUrl, itrUrl]
    )

    res.json({
      message: "Documents uploaded successfully",
      bank_statement_url: bankUrl,
      salary_slip_url: salaryUrl,
      itr_document_url: itrUrl
    })

  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}



exports.processApplication = async (req, res) => {

 try {

  const { application_id } = req.body

  const result = await sendToOrchestrator(application_id)

  res.json(result)

 }
 catch (error) {

  res.status(500).json(error)

 }

}

exports.trackApplication = async (req, res) => {

 try {

  const { id } = req.params

  const result = await db.query(
  `SELECT 
    a.application_id,
    a.status,
    a.kyc_status,
    a.reason,
    a.created_at,
    
    ar.credit_pd_score,
    ar.fraud_probability,
    ar.employment_verified,
    ar.final_decision

   FROM applications a
   LEFT JOIN agent_results ar
   ON a.application_id = ar.application_id

   WHERE a.application_id = $1`,
  [id]
);



  if (result.rows.length === 0) {
   return res.status(404).json({ message: "Application not found" })
  }

  const app = result.rows[0]

  let message = ""

  if (app.status === "REJECTED") {
    message = `Application Rejected: ${app.reason}`
  }
  else if (app.status === "ESCALATED") {
    message = "Your application is under review by credit officer"
  }
  else if (app.status === "APPROVED") {
    message = "Your application is approved"
  }
  else {
    message = "Your application is in progress"
  }

  res.json({
  ...app,
  user_message: message,
  agent_scores: {
    credit_pd_score: app.credit_pd_score,
    fraud_probability: app.fraud_probability,
    employment_verified: app.employment_verified,
    final_decision: app.final_decision
  }
});

 }
 catch (error) {

  res.status(500).json(error)

 }

}

exports.getUserApplications = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    if (!req.user?.id) {
      return res.status(400).json({ message: "User ID missing in token" });
    }

    const userId = req.user.id;

    const result = await db.query(
      `SELECT application_id, status, kyc_status, created_at
       FROM applications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    console.log("APPLICATIONS FOUND:", result.rows);

    res.json(result.rows);

  } catch (err) {
    console.error("GET APPLICATION ERROR:", err);
    res.status(500).json(err);
  }
};