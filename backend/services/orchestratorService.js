const axios = require("axios")

const ORCHESTRATOR_URL = "http://localhost:9000/process-application"

exports.sendToOrchestrator = async (application_id) => {

 try {

  console.log("Sending application to orchestrator:", application_id)

  const response = await axios.post(
   ORCHESTRATOR_URL,
   {
    application_id: application_id
   }
  )

  return response.data

 }
 catch (error) {

  console.error(
   "Orchestrator Error:",
   error.response?.data || error.message
  )

  throw error
 }

}