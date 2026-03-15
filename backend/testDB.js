const pool = require("./config/db")

async function testDB() {

    try {

        const res = await pool.query("SELECT NOW()")

        console.log("Database Connected Successfully")
        console.log(res.rows)

    }

    catch(err) {

        console.error(err)

    }

}

testDB()