const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const {createUser,findUserByEmail} = require("../models/userModel")

exports.signup = async(req,res)=>{

    try{

        const {full_name,email,password,phone_number} = req.body

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await createUser({
            full_name,
            email,
            password_hash:hashedPassword,
            phone_number
        })

        res.json(user)

    }catch(err){

        res.status(500).json({error:err.message})

    }

}


exports.login = async(req,res)=>{

    try{

        const {email,password} = req.body

        const user = await findUserByEmail(email)

        if(!user){

            return res.status(400).json({error:"User not found"})

        }

        const match = await bcrypt.compare(password,user.password_hash)

        if(!match){

            return res.status(400).json({error:"Invalid password"})
        }

        const token = jwt.sign(
            {id:user.id},
            "secret",
            {expiresIn:"1d"}
        )

        res.json({token})

    }

    catch(err){

        res.status(500).json({error:err.message})

    }

}