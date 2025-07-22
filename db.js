const mysql = require("mysql2");
const config = require("./config");

const pool = mysql.createPool(config);

const connectDB = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("DB Connection Error:", err.message);
        } else {
            console.log("Connected to MySQL");
            connection.release();
        }
    });
};

module.exports = { connectDB, pool };
