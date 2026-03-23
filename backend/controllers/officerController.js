const db = require("../config/db");


exports.getEscalatedApplications = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT application_id, user_id, loan_amount, loan_tenure, loan_purpose, created_at
       FROM applications 
       WHERE status = 'ESCALATED'
       ORDER BY created_at DESC`
    );

    res.json({
      count: result.rows.length,
      applications: result.rows
    });

  } catch (err) {
    console.error("ESCALATED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.getApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await db.query(
      `SELECT * FROM applications WHERE application_id = $1`,
      [id]
    );

    if (application.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const profile = await db.query(
      `SELECT * FROM applicant_profiles WHERE application_id = $1`,
      [id]
    );

    const employment = await db.query(
      `SELECT * FROM employment_details WHERE application_id = $1`,
      [id]
    );

    const financial = await db.query(
      `SELECT * FROM financial_details WHERE application_id = $1`,
      [id]
    );

    const documents = await db.query(
      `SELECT * FROM documents WHERE application_id = $1`,
      [id]
    );

    const agent = await db.query(
      `SELECT * FROM agent_results WHERE application_id = $1`,
      [id]
    );

    res.json({
      application: application.rows[0],
      profile: profile.rows[0],
      employment: employment.rows[0],
      financial: financial.rows[0],
      documents: documents.rows[0],
      agent_result: agent.rows[0]
    });

  } catch (err) {
    console.error("DETAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.updateDecision = async (req, res) => {
  try {
    const { application_id, decision, reason } = req.body;

    if (!application_id || !decision) {
      return res.status(400).json({
        message: "application_id and decision are required"
      });
    }

    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res.status(400).json({
        message: "Decision must be APPROVED or REJECTED"
      });
    }

    await db.query(
      `UPDATE applications 
       SET status = $1,
           reason = $2
       WHERE application_id = $3`,
      [decision, reason || null, application_id]
    );

    res.json({
      message: "Decision updated successfully",
      application_id,
      status: decision,
      reason: reason || null
    });

  } catch (err) {
    console.error("DECISION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};