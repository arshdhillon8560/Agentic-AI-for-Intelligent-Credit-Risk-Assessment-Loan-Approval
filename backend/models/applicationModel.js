const pool = require("../config/db")

const createApplication = async(data)=>{

    const {
        application_id,
        user_id,
        loan_amount,
        loan_tenure,
        loan_purpose
    } = data

    const result = await pool.query(
        `INSERT INTO applications
        (application_id,user_id,loan_amount,loan_tenure,loan_purpose)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *`,
        [application_id,user_id,loan_amount,loan_tenure,loan_purpose]
    )

    return result.rows[0]
}

module.exports = {
    createApplication
}