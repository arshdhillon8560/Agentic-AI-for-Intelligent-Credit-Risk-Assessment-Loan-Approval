const db = require("../config/db")


exports.getEscalatedApplications = async(req,res)=>{

 try{

  const result = await db.query(
   `SELECT * FROM applications WHERE status='ESCALATED'`
  )

  res.json(result.rows)

 }
 catch(err){

  res.status(500).json(err)

 }

}



exports.getApplicationDetails = async(req,res)=>{

 try{

  const {id} = req.params

  const application = await db.query(
   `SELECT * FROM applications WHERE application_id=$1`,
   [id]
  )

  const profile = await db.query(
   `SELECT * FROM applicant_profiles WHERE application_id=$1`,
   [id]
  )

  const employment = await db.query(
   `SELECT * FROM employment_details WHERE application_id=$1`,
   [id]
  )

  const financial = await db.query(
   `SELECT * FROM financial_details WHERE application_id=$1`,
   [id]
  )

  const documents = await db.query(
   `SELECT * FROM documents WHERE application_id=$1`,
   [id]
  )

  const agent = await db.query(
   `SELECT * FROM agent_results WHERE application_id=$1`,
   [id]
  )

  res.json({
   application:application.rows[0],
   profile:profile.rows[0],
   employment:employment.rows[0],
   financial:financial.rows[0],
   documents:documents.rows[0],
   agent_result:agent.rows[0]
  })

 }
 catch(err){

  res.status(500).json(err)

 }

}



exports.updateDecision = async(req,res)=>{

 try{

  const {application_id, decision} = req.body

  await db.query(
   `UPDATE applications SET status=$1 WHERE application_id=$2`,
   [decision,application_id]
  )

  res.json({
   message:"Decision updated",
   status:decision
  })

 }
 catch(err){

  res.status(500).json(err)

 }

}