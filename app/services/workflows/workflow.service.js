const db = require("../../models");
const config = require("../../config/auth.config");
const Admin = db.admin;
const Admininfo = db.admininfo;
const User = db.user;
const Status = db.status;
const Workflow = db.workflow;
const Order = db.order;
const Profile = db.profile;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const emailservice = require('../../services/email.service');

const getAllworkflow = async (req, res) => {
    try {

        const admin = db.admin.findOne({
            where: {
                adminToken: req.body.adminToken,
            }
        });

        if (!admin) {
            return res.status(404).send({ message: "Admin Not found." });
        }

        const work_flow = await Workflow.findAll();

        res.status(200).send(work_flow);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = {
    getAllworkflow,
}