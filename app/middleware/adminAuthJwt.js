const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const { Admininfo } = require("../models");
const db = require("../models");
const Admin = db.admin;
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(adminToken, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.adminId = decoded.id;
    next();
  });
};
verifyTokenwithid = (req, res, next) => {
  let adminToken = req.headers["x-access-token"];
  if (!adminToken) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(adminToken, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.adminId = decoded.id;
    if (decoded.id!=req.body.id) {
      return res.status(401).send({
        message: "User not matching with the credentials"
      });
    }
    next();
  });
};

const adminAuthJwt = {
  verifyToken: verifyToken,
  verifyTokenwithid: verifyTokenwithid
};
module.exports = adminAuthJwt;
