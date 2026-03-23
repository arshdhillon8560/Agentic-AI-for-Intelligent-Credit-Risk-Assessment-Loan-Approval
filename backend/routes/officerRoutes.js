const express = require("express");
const router = express.Router();

const officerController = require("../controllers/officerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get(
  "/escalated",
  authMiddleware,
  roleMiddleware("officer"),
  officerController.getEscalatedApplications
);

router.get(
  "/application/:id",
  authMiddleware,
  roleMiddleware("officer"),
  officerController.getApplicationDetails
);

router.post(
  "/decision",
  authMiddleware,
  roleMiddleware("officer"),
  officerController.updateDecision
);

module.exports = router;