const db = require("../../models");
const config = require("../../config/auth.config");
const { user, Sequelize } = require("../../models/index");

const status_info = db.statusinfo

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
//const fetch = require("node-fetch");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const authvalidation = require('../../validations/auth.validation')
const emailservice = require('../email.service');
const { email } = require("../../config/config");
const SignupValidation = require("../../validations/signupvalidation");
const SigninValidation = require("../../validations/signinvalidation");

// const statusentry = async (req, res) =>{
//     const state = {
//         status: req.body.statuscode,
//         statusinfo: req.body.statusinfo
//     };
//     try {
//         const newstatusinfo = await status_info.create(state);
//         res.send(200).send({
//             message:
//             "status created"
//         });

//     }
//     catch (err) {
//         res.status(500).send({
//           message:
//             "Some error occurred while creating status."
//         });
//       }
// };


// module.exports = {
//     statusentry,
// }