module.exports = app => {
  const user = require("../../controllers/user/user.controller.js");
  const userinfo = require("../../controllers/user/user.controller.js");
  const { authJwt } = require("../../middleware/index.js");
  const { verifySignUp } = require("../../middleware/index.js");
  const passport = require('passport');
 

  var router = require("express").Router();

  
  app.use('/api/user', router);

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  // Retrieve all clothing
  router.get("/", [authJwt.verifyTokenwithid],user.userBoard);
  //user forgotPassword 
  //api//user/forgotpassword
  router.post("/forgotpassword",user.forgotpassword);
  //user resetPassword
  //api//user/resetpassword
  router.post("/resetpassword",user.resetpassword);

  router.post("/passwordreset",[authJwt.verifyTokenwithid],user.passwordreset);
  

// Create a a post for signup
//api/user/register
 router.post("/register",[verifySignUp.checkDuplicateUsernameOrEmail],user.signup);
 // Create  a post for signin
 // api/user/login
 router.post("/login", user.signin);
 //get all register user :admin
 router.post("/user",userinfo.getAllUser);
 //get one register user
 router.post("/oneuser",userinfo.getOneUser);
 //get one register user:admin
 router.post("/oneuseradmin",userinfo.getOneUserAdmin);

 //create a  register userinfo
 router.post("/createuserinfo",userinfo.createuserinfo);
 //update a register userinfo
 router.put("/updateuserinfo",userinfo.updateuserinfo);

 //update a register user
 router.put("/updateuser",userinfo.updateUser);
 





 //find all register user view for admin
 //api//user/registeruser
 router.get("/registeruser",user.allRegisterUser);
// admin can cancel user: admin
 router.put("/admincanceluser",user.adminCancelUser);
 //  user count for admin
 router.post("/allusercount",user.allUserCount);
 router.post("/getstatus",user.getstatususer)

 app.use('/api/user', router);

};
