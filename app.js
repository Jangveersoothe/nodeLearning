const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
console.log("DB:", process.env.DATABASE);


const {connectDB} = require("./db");
const route = require("./route");
const uploadRoute = require("./uploadroute");

const port = process.env.PORT;
const app = express();

app.use("/", uploadRoute);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/",route);

connectDB();

app.get('/', (req,res) => {
  res.send("Hard work beats talent when talent doesn't work hard!");
});


app.listen(port, ()=>{
  console.log(`Server started at: ${port}`);
})
