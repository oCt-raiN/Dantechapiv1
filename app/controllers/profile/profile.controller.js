const db = require("../../models");
nodemailer = require('nodemailer');
const profileservice = require("../../services/profile/profile.service")

exports.profilentry = (req, res)=>{
    profileservice.profilereg(req, res);
};