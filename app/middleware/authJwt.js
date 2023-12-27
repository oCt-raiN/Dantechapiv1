const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Profbooking = db.profbooking;
verifyToken = (req, res, next) => {
  let userToken = req.headers["x-access-token"];
  if (!userToken) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(userToken, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    User.findOne({
      where: {
        userToken: decoded.id
      }
    }).then(user => {
      if (!user) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = user.id;
      next();
    });
  });
};

verifyTokenwithid = (req, res, next) => {
  let userToken = req.headers["x-access-token"];
  if (!userToken) {
    return res.status(403).send({
      message: "No userToken provided!"
    });
  }
  jwt.verify(userToken, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    User.findOne({
      where: {
        userToken: decoded.id
      }
    }).then(user => {
      if (!user) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.user = user;
      if (decoded.id != user.userToken) {
        return res.status(401).send({
          message: "User not matching with the credentials"
        });
      }
      next();
    });
  });
};
// const verifyTokenwithaccessToken = async (req, res, next) => {
//   const userToken = req.body.userToken;
//   const accessToken = req.headers["x-access-token"];
  
//   if (!userToken || !accessToken) {
//     return res.status(403).send({
//       message: "No userToken or accessToken provided!"
//     });
//   }
  
//   try {
//     const decodedAccessToken = jwt.verify(accessToken, config.secret);
//     const user = await User.findOne({ where: { userToken} });
    
//     if (!user) {
//       return res.status(401).send({
//         message: "Unauthorized!"
//       });
//     }
    
//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).send({
//       message: "Unauthorized!"
//     });
//   }
// };
const verifyTokenwithaccessToken = async (req, res, next) => {
  const userToken = req.body.userToken;
  const accessToken = req.headers["x-access-token"];
  
  console.log(`Access token: ${accessToken}`);
  if (!userToken || !accessToken) {
    return res.status(403).send({
      message: "No userToken or accessToken provided!"
    });
  }
  
  try {
    const decodedAccessToken = jwt.verify(accessToken, config.secret);
    console.log(JSON.stringify(decodedAccessToken));
    
    if (decodedAccessToken.id !== userToken) {
      return res.status(401).send({
        message: "UserToken does not match with the accessToken!"
      });
    }
    
    const user = await User.findOne({ where: { userToken } });
    
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};
isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  verifyTokenwithid: verifyTokenwithid,
  verifyTokenwithaccessToken:verifyTokenwithaccessToken
};
module.exports = authJwt;
