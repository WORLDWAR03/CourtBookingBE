const jwt = require("jsonwebtoken");
const user = require("../models/userSchema");
const venderAuth = (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers["authorization"].split(" "); //returns an array ['Barer', 'jjjjjkdjaoufhoua-token']

    jwt.verify(token[1], process.env.JWT, (err, decodedToken) => {
      if (decodedToken) {
        if (decodedToken?.role === 2 || decodedToken?.role === 3) {
          req.userId = decodedToken.userId;
          next();
        } else {
          res.status(401).json({ message: "unauthorized request" });
        }
      } else {
        res.status(401).json({ message: "unauthorized request" });
      }
    });
  } catch (error) {
    res.status(403).json({ message: "some thing went wrong" });
  }
};
module.exports = venderAuth;
