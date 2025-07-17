const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
console.log("DB:", process.env.DATABASE);


const {connectDB} = require("./db");
const route = require("./route");
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/",route);

connectDB();

app.get('/', (req,res) => {
  res.send("App running");
});





app.listen(port, ()=>{
  console.log(`Server started at: ${port}`);
})
