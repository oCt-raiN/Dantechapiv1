const db = require("../../models");
const config = require("../../config/auth.config");
const Admin = db.admin;
const Admininfo = db.admininfo;
const User = db.user;
const Status = db.status;
const workflow = db.workflow;
const Order = db.order;
const Profile = db.profile;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const emailservice = require('../../services/email.service');

const getAllworkflow = async (req, res) => {
    try {
        const admin = Admin.findOne({
            where: {
                adminToken: req.body.adminToken,
            }
        });

        if (!admin) {
            return res.status(404).send({ message: "Admin Not found." });
        }

        if (!req.body || !req.body.form) {
            return res.status(400).send({
                message: "Invalid request. 'form' property is missing in the request body.",
            });
        }

        const work_flow = await workflow.findAll();

        res.status(201).send(work_flow);
    }
    catch (err) {
        console.error(err);

        res.status(500).send({
            message: "Some error occurred while creating order.",
        });
    }
};

module.exports = {
    getAllworkflow,
}