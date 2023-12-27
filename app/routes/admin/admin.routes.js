module.exports = app => {
  const admin = require("../../controllers/admin/admin.controller");
  const admininfo = require("../../controllers/admin/admin.controller");
  const { adminVerifySignUp } = require("../../middleware");

  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  //register admin
  //api/admin/register
  router.post("/register", [adminVerifySignUp.duplicateUsernameOrEmail], admin.signup);
  //login admin
  //api/admin/login
  router.post("/login", admin.signin);
  //admin password forgot
  //api/admin/forgotpassword
  router.post("/forgotpassword", admin.forgotpassword);
  //admin password reset
  //api/admin/resetpassword
  router.post("/resetpassword", admin.resetpassword);
  // update admin
  router.put("/updateAdmin", admin.updateAdmin);
  //  createAdminInfo
  router.post("/createAdminInfo", admininfo.createAdminInfo);
  // updateAdminInfo
  router.put("/updateAdminInfo", admininfo.updateAdminInfo);
  // get one
  router.post("/getOneAdmin", admin.getOneAdmin);
  //create user
  router.post("/userregister", admin.createuser)
  // get users
  router.post("/getallusers", admin.getallusers)
  router.put("/rejectuser", admin.rejectusers)
  router.put("/approveuser", admin.approveusers)
  router.post("/getallorder", admin.getallorders)

  app.use('/api/admin', router);
};    