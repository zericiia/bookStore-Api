const jwt = require("jsonwebtoken");

//  verify Token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}

// Verify Token And Authorize The User
function verifyTokenAndAuthorizaton(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: `you are not allowed ${req.params.id} -------${req.user.id}` });
    }
  });
}
// Verify Token And Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.param.isAdmin) {
      next();
    } else {
      // 403 is forbiden
      return res.status(403).json({ message: "you are not allowed, only Admins are allowed" });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndAuthorizaton,
  verifyTokenAndAdmin,
};
