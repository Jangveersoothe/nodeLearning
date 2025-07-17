
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {pool} = require("./db");



const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query(
    "INSERT INTO users(email, password) VALUES (?,?)",
    [email, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Invalid Username or Password" });
      }
      const token = generateToken(result.insertId);
      res.status(201).json({ token });
    }
  );
};

const login = (req, res) => {
  [email, password] = req.body;

  pool.query (
    "SELECT * FROM users WHERE email = ?", [email],async (err, result) =>{
      if(err){
        return res.status(401).json({error: "User not found"});
      }
      if(result.length ===0 ){
        return res.status(401).json({error: "User not found"});
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password,hashedPassword);

      if(!isMatch){
        return res.status(401).json({error: "Wrong password"});
      }

      const token = generateToken(user.id);
      res.json({token});

    }
  )
}

// const p

module.exports = {signup, login};
