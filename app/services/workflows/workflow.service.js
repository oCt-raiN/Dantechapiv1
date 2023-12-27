const db = require("../../models");
const config = require("../../config/auth.config");
const Admin = db.admin;
const Admininfo = db.admininfo;
const User = db.user;
const Workflow = db.workflow;

const Status = db.status;
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
            res.status(404).send({
                message: "Admin cannot be found!!",
            })
        }

        const workflow = await Workflow.findAll()

        res.status(200).send({
            workflow, adminToken
        })
    } catch (err) {
        res.status(500).send({
            message: "Some error occured while getting workflow"
        })
    }
}


module.exports = {
    getAllworkflow,
};