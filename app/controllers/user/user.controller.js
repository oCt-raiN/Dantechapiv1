const db = require("../../models");
nodemailer = require('nodemailer');
const userService = require('../../services/user/user.service');

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
exports.signup = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  userService.register(req, res);
};
exports.signin = (req, res) => {
  userService.login(req, res);
};
//Forgot password
exports.forgotpassword = (req, res) => {
  userService.forgotpassword(req, res);
};
//Reset password through forgot password 
exports.resetpassword = (req, res) => {
  console.log("Inside reset password");
  console.log(req);
  userService.resetpassword(req, res);
};
//Reset password after log-on using credentials 
exports.passwordreset = (req, res) => {
  userService.passwordreset(req, res);
};
exports.allRegisterUser = (req, res) => {
  userService.allRegisterUser(req, res);
};
exports.getAllUser = (req, res) => {
  userService.getAllUser(req, res);
};
exports.getOneUser = (req, res) => {
  userService.getOneUser(req, res);
};
exports.getOneUserAdmin = (req, res) => {
  userService.getOneUserAdmin(req, res);
};
exports.createuserinfo = (req, res) => {
  userService.createuserinfo(req, res);
};
exports.updateuserinfo = (req, res) => {
  userService.updateuserinfo(req, res);
};
exports.updateUser = (req, res) => {
  userService.updateUser(req, res);
};
exports.adminCancelUser = (req, res) => {
  userService.adminCancelUser(req, res);
};
exports.allUserCount = (req, res) => {
  userService.allUserCount(req, res);
};
exports.getstatususer = (req, res) => {
  userService.getstatus(req, res);
}





