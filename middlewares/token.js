const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Extract the token from the request headers
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  // If no token is provided, return an error response
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Attach the decoded payload to the request object for use in subsequent middleware or routes
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return an error response
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = { verifyToken };
