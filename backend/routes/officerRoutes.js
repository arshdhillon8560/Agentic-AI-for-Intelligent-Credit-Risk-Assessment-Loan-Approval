const express = require("express")
const router = express.Router()
const officerController = require("../controllers/officerController")

router.get("/escalated", officerController.getEscalatedApplications)

router.get("/application/:id", officerController.getApplicationDetails)

router.post("/decision", officerController.updateDecision)

module.exports = router