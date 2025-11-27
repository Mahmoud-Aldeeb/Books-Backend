const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  let token = req.headers.token;

  // if (token) {
  //   token = token.replace(/[^\w\.\-\_]/g, "").trim();
  //   console.log("Cleaned Token:", token);
  // }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid token." });
    }
  } else {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }
}

// verify Token & Authorization the user
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "You are not allowed to do that!" });
    }
  });
}

// verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "You are not allowed to do that!" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
