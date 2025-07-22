const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({error: "User not authenticated!"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({error: "Invalid token"});
    }
}

module.exports = verifyToken;