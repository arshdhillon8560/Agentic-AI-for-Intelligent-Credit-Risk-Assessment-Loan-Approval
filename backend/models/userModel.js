const pool = require("../config/db")

const createUser = async (user) => {

    const {full_name,email,password_hash,phone_number} = user

    const result = await pool.query(
        `INSERT INTO users(full_name,email,password_hash,phone_number)
         VALUES($1,$2,$3,$4)
         RETURNING *`,
        [full_name,email,password_hash,phone_number]
    )

    return result.rows[0]
}

const findUserByEmail = async (email) => {

    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    )

    return result.rows[0]
}

module.exports = {
    createUser,
    findUserByEmail
}