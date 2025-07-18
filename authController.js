const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { pool } = require("./db");

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
          return res
            .status(500)
            .json({ error: "Email already exists or invalid" });
        }

        const userId = result.insertId;
        const token = generateToken(userId);

        res.status(201).json({
          success: true,
          message: "Signup successful",
          user: {
            id: userId,
            email,
            is_active: true,
            token,
          },
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Something went wrong during signup" });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err || result.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Wrong password" });
      }

      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email,
          is_active: true,
          token,
        },
      });
    }
  );
};

const reqPassReset = async (req, res) => {
  const { email } = req.body;

  pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const user = results[0];
      const secret = user.password + process.env.JWT_SECRET;
      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: "1h",
      });

      const resetURL = `http://localhost:3000/resetpassword/${user.id}/${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password reset request",
        text: `Click the link to reset your password:\n\n${resetURL}\n\n`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Mail Sent" });
      } catch (err) {
        res.status(500).json({ message: "Mail not sent" });
      }
    }
  );
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  pool.query("SELECT * FROM users WHERE id = ?", [id], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = results[0];
    const secret = user.password + process.env.JWT_SECRET;

    try {
      jwt.verify(token, secret);

      const hashedPassword = await bcrypt.hash(password, 10);

      pool.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id],
        (updateErr) => {
          if (updateErr) {
            return res
              .status(500)
              .json({ message: "Failed to reset password" });
          }

          return res
            .status(200)
            .json({ message: "Password has been reset successfully" });
        }
      );
    } catch (tokenErr) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  });
};

module.exports = { signup, login, reqPassReset, resetPassword };
