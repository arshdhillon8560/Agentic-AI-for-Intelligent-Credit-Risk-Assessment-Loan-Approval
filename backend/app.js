require("dotenv").config()

const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const kycRoutes = require("./routes/kycRoutes")
const applicationRoutes = require("./routes/applicationRoutes")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())


// Routes
app.use("/auth", authRoutes)
app.use("/kyc", kycRoutes)
app.use("/application", applicationRoutes)


// Test route
app.get("/", (req,res)=>{
    res.send("Loan Approval Backend Running")
})


const PORT = 5000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})