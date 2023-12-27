const db = require("../../models");
nodemailer = require('nodemailer');
const doctorservice = require("../../services/doctor/doctor.service")

exports.adddoc = (req, res)=>{
    doctorservice.adddoctor(req, res);
}

exports.getalldoctordata = (req, res) =>{
    doctorservice.getdoctors(req,res);
}