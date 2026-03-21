const express = require("express")
const router = express.Router()

const upload = require("../middleware/uploadMiddleware")
const authMiddleware = require("../middleware/authMiddleware")

const {
 createApplication,
 saveApplicantProfile,
 saveEmployment,
 saveFinancial,
 uploadDocuments,
 processApplication,
 trackApplication,
 getUserApplications
} = require("../controllers/applicationController")

// Protected routes
router.post("/create", authMiddleware, createApplication)

router.post("/profile", authMiddleware, saveApplicantProfile)

router.post("/employment", authMiddleware, saveEmployment)

router.post("/financial", authMiddleware, saveFinancial)

router.get("/all", authMiddleware, getUserApplications);

router.post(
 "/upload-documents",
 authMiddleware,
 upload.fields([
  {name:"bank_statement",maxCount:1},
  {name:"salary_slip",maxCount:1},
  {name:"itr_document",maxCount:1}
 ]),
 uploadDocuments
)

router.post("/process", authMiddleware, processApplication)

router.get("/status/:id", authMiddleware, trackApplication)

module.exports = router