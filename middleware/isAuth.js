const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) {
    const error = new Error("Not Authenticatd!");
    error.statusCode = 401;
    throw error;
  };
  token = token.split(" ")[1];

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodeToken) {
    const error = new Error("Not Authenticatd!");
    error.statusCode = 401;
    throw error;
  }
  req.body.phone = decodeToken.phone;
  req.phone = decodeToken.phone;
  

  next();
};
