
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {pool} = require("./db");



const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const signup = async (req, res) => {
  const { email, password } = req.body;


  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Email already exists or invalid" });
        }

        const userId = result.insertId;
        const token = generateToken(userId);

        const response_script = {
          success: true,
          message: "Signup successful",
          user: {
            id: userId,
            email,
            is_active: true,
            token
          }
        };

        res.status(201).json(response_script);
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Something went wrong during signup" });
  }
};


const login = (req, res) => {
  const {email, password} = req.body;

  pool.query (
    "SELECT * FROM users WHERE email = ?", [email],async (err, result) =>{
      if(err){
        return res.status(401).json({error: "User not found"});
      }
      if(result.length ===0 ){
        return res.status(401).json({error: "User not found"});
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password,user.password);

      if(!isMatch){
        return res.status(401).json({error: "Wrong password"});
      }


      const token = generateToken(user.id);
      const response_script = {
          success: true,
          message: "Login successful",
          user: {
            id: user.Id,
            email,
            is_active: true,
            token
          }
        };

      res.status(200).json({response_script});

    }
  )
}

// const p

module.exports = {signup, login};
