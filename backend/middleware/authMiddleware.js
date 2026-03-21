const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secret");

    // ✅ DEBUG LOG (VERY IMPORTANT)
    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};