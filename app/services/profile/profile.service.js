const db = require("../../models");
const config = require("../../config/auth.config");
const { user, Sequelize } = require("../../models/index");
const Profile = db.profile
const User = db.user
const Bankprofile = db.bankdetail
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const emailservice = require('../email.service');

const profilereg = async (req, res) => {
  const user = await User.findOne({
    where: { userToken: req.body.userToken },
  });

  Profile.update(

    {
      alternativenumber: req.body.profile.alternativenumber,
      city: req.body.profile.city,
      state: req.body.profile.state,
      pincode: req.body.profile.pincode,
      country: req.body.profile.country,


    },
    {
      where: {
        clinicid: user.clinicid
      }
    }
  )
  Bankprofile.update(
    {
      bankacnumber: req.body.profile.bank_acNo,
      ifsc: req.body.profile.ifsc,
      bankbranch: req.body.profile.bank_brnch,
      upiid: req.body.profile.upi_id,
      gst: req.body.profile.gst,
    },
    {
      where: {
        clinicid: user.clinicid
      }
    }
  )
    .then(rowsAffected => {
      if (rowsAffected[0] === 0) {
        return res.status(404).send({
          message: "user not found with token " + req.body.userToken
        });
      }
      res.send({
        message: "user was updated successfully with token " + req.body.userToken
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the professional."
      });
    });


};



module.exports = {
  profilereg,
}