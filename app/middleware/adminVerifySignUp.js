const db = require("../models");
const Admin = db.admin;
 duplicateUsernameOrEmail = (req, res, next) => {
//   // Username
// Professionalinfo.findOne({
//     where: {
//       email: req.body.email
//     }
//   }).then(professionalinfo => {
//     if (professionalinfo) {
//       res.status(400).send({
//         message: "Failed! Username is already in use!"
//       });
//       return;
//     }
    // Email
Admin.findOne({
      where: {
        email: req.body.email
      }
    }).then(admin => {
      if (admin) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }
      next();
    });
  };

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};
const adminVerifySignUp = {
  duplicateUsernameOrEmail: duplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};
module.exports = adminVerifySignUp;