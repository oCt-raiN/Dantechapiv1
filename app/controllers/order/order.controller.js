const db = require("../../models");
nodemailer = require('nodemailer');
const orderservice = require("../../services/order/order.service")


exports.createorders = (req, res) => {
    orderservice.createorder(req, res);
};

exports.getallorders = (req, res) => {
    orderservice.getAllOrder(req, res);
};

exports.getoneorder = (req, res) => {
    orderservice.getOneorder(res, req);
};