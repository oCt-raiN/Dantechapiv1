const { admin } = require("googleapis/build/src/apis/admin");
const adminService = require("../../services/admin/admin.service");
nodemailer = require('nodemailer');
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.professionalDetail = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
//Forgot password
exports.forgotpassword = (req, res) => {
  adminService.forgotpassword(req, res);
}
//Reset password through forgot password 
exports.resetpassword = (req, res) => {
  console.log("Inside reset password");
  console.log(req);
  adminService.resetpassword(req, res);
}
//Reset password after log-on using credentials 
exports.passwordreset = (req, res) => {
  adminService.passwordreset(req, res);
}
exports.verifyToken = (req, res) => {
  res.status(200).send("token verified.");
  adminService.conformpassword(req, res);
};
exports.signup = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  adminService.register(req, res);
};
exports.signin = (req, res) => {
  adminService.login(req, res);
};
exports.createAdminInfo = (req, res) => {
  adminService.createAdminInfo(req, res);
};
exports.getallusers = (req, res) => {
  adminService.getAllUser(req, res);
}
exports.updateAdminInfo = (req, res) => {
  adminService.updateAdminInfo(req, res);
};
exports.updateAdmin = (req, res) => {
  adminService.updateAdmin(req, res);
};
exports.getOneAdmin = (req, res) => {
  adminService.getOneAdmin(req, res);
};
exports.createuser = (req, res) => {
  adminService.userregister(req, res);
}

exports.rejectusers = (req, res) => {
  adminService.rejectuser(req, res);
}

exports.approveusers = (req, res) => {
  adminService.approveuser(req, res);
}

exports.getallorders = (req, res) => {
  adminService.getallorders(req, res);
}