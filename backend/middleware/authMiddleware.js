const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{

 try{

  const authHeader = req.headers.authorization

  if(!authHeader){
   return res.status(401).json({error:"Token missing"})
  }

  const token = authHeader.split(" ")[1]

  const decoded = jwt.verify(token,"secret")

  req.user = decoded

  next()

 }

 catch(err){

  return res.status(401).json({error:"Invalid token"})

 }

}