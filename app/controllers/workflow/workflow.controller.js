const db = require("../../models");
nodemailer = require('nodemailer');
const workflowservice = require("../../services/workflows/workflow.service")

exports.getallworkflows = (req, res) => {
    workflowservice.getAllworkflow(res, req);
};