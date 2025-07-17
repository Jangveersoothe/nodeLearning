// const mysql = require("mysql2");
// const config = require("./config");

// const connectDB = async () =>{
//     const pool = mysql.createPool(config);

//     pool.getConnection((err, connection) => {
//         if(err){
//             console.log({error: err.message});
//         }

//         console.log("Connecteed to DB");
//         connection.release();
//     });
// };

// module.exports = connectDB;
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
