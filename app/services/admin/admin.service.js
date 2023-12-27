const db = require("../../models");
const config = require("../../config/auth.config");
const Admin = db.admin;
const Admininfo = db.admininfo;
const User = db.user;
const Status = db.status;
const Orderforms = db.order;
const Profile = db.profile;
const Bankprofile = db.bankdetail
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const emailservice = require('../../services/email.service');


const rejectuser = async (req, res) => {

  const user = await User.findOne({
    where: { userToken: req.body.userToken },
  });

  descrip = req.body.description.description;
  Status.update(
    {
      statuscode: "RJ5000",
      description: req.body.description.description,
    },
    {
      where: {
        clinicid: user.clinicid
      }
    }
  ).then(rowsAffected => {
    if (rowsAffected[0] === 0) {
      return res.status(404).send({
        message: "user not found with token " + req.body.userToken
      });
    }
    emailservice.rejectedmail(user.email, user.clinicName, user.clinicid, descrip);
    res.send({
      message: "user was updated successfully with token " + req.body.userToken
    });
  })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the professional."
      });
    });
}

const approveuser = async (req, res) => {

  const user = await User.findOne({
    where: { userToken: req.body.userToken },
  });
  Status.update(
    {
      statuscode: "AC2000",
    },
    {
      where: {
        clinicid: user.clinicid
      }
    }
  ).then(rowsAffected => {
    if (rowsAffected[0] === 0) {
      return res.status(404).send({
        message: "user not found with token " + req.body.userToken
      });
    }
    emailservice.approvedmail(user.email, user.clinicName, user.clinicid);
    res.send({
      message: "user was updated successfully with token " + req.body.userToken
    });
  })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the professional."
      });
    });
}


const getAllUser = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        adminToken: req.body.userToken
      }
    });
    const user = await User.findAll()
    const state = await Status.findAll()
    res.status(200).send({
      user, state
    });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while getting details."
    });
  }
};



const getallorders = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: {
        adminToken: req.body.userToken
      }
    });
    const order = await Orderforms.findAll()
    res.status(200).send({
      order
    });
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while getting order details."
    });
  }
};


function generateString() {
  // Get current date and time
  const currentDate = new Date();

  // Extract hours and month
  const currentHour = currentDate.getHours();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed

  // Generate random two-digit number for the last two digits
  const randomDigits = Math.floor(Math.random() * 100);

  // Format components to ensure they have leading zeros if needed
  const formattedHour = currentHour.toString().padStart(2, '0');
  const formattedMonth = currentMonth.toString().padStart(2, '0');
  const formattedRandomDigits = randomDigits.toString().padStart(2, '0');

  // Concatenate components to form the final string
  const resultString = `A${formattedHour}${formattedMonth}${formattedRandomDigits}`;

  return resultString;
}


// Create a user
const userregister = async (req, res) => {
  // const admin = await Admin.findOne({
  //   where: { adminToken: req.body.adminToken } ,
  //   attributes: { exclude: ['createdAt', 'updatedAt'] },
  // });
  // if (!admin) {
  //   return res.status(404).send({
  //     message: "Admin not found with token " + req.body.adminToken
  //   });
  // }
  const checkuser = await User.findOne({
    where: {
      email: req.body.email
    }
  });

  console.log(checkuser)
  if (checkuser) {
    return res.status(404).send({ message: "User Already exist." });
  }

  const clinic_id = generateString();
  const state = {
    clinicid: clinic_id
  }

  const user = {
    clinicid: clinic_id,
    clinicName: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phonenumber: req.body.phonenumber,
    password: bcrypt.hashSync(req.body.password, 8),
    userToken: tokgen2.generate(),
  };

  try {
    // Save professional in the database
    const newUser = await User.create(user);
    // console.log(newUser);
    const userstat = await Status.create(state);
    // console.log(userstat);
    const newprofile = await Profile.create(user);
    // console.log(newprofile);
    const newbankprofile = await Bankprofile.create(state);
    // Exclude the specified fields from the output
    const result = {
      // fullName: newUser.firstName+' '+newUser.lastName,
      // clinicid: newUser.clinicid,
      clinicName: newUser.clinicName,
      address: newUser.clinicName,
      phonenumber: newUser.phonenumber,
      email: newUser.email,
      password: newUser.password,
      userToken: newUser.userToken,

    };

    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating user."
    });
  }
};

// register professional
const register = async (req, res) => {
  const admin = {
    firstName: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    adminToken: tokgen2.generate(),
  };

  try {
    // Save professional in the database
    const newAdmin = await Admin.create(admin);

    // Exclude the specified fields from the output
    const result = {
      firstName: newAdmin.name,
      email: newAdmin.email,
      token: newAdmin.token,
      password: newAdmin.password,
      adminToken: newAdmin.adminToken

    };

    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating user."
    });
  }
};


const login = async (req, res) => {
  Admin.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(404).send({ message: "professional Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        admin.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var adminToken = jwt.sign({ id: admin.adminToken }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var refreshtoken = jwt.sign({ id: admin.adminToken }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var fullName = `${admin.firstName} ${admin.lastName}`;
      res.status(200).send({
        adminToken: admin.adminToken,
        accessToken: adminToken,
        refreshtoken: refreshtoken,
        fullName: fullName

      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const forgotpassword = async (req, res) => {

  Admin.findOne({
    where: {
      email: req.body.email,
      adminToken: Admin.adminToken
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(404).send({ message: "Email not exists." });
      } else {

        const resetToken = tokgen2.generate();

        Admin.update({ resetToken: resetToken }, {
          where: { adminToken: admin.adminToken }

        }).then(
          emailservice.sendResetPasswordEmail(admin.email, resetToken)
        )

        return res.status(200).send({ message: "Reset link send to the registered email id" });

      }

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const resetpassword = async (req, res) => {

  Admin.findOne({
    where: {
      resetToken: req.body.resetToken
    }
  })
    .then(admin => {
      console.log(admin);
      if (!admin) {
        return res.status(404).send({ message: "The reset link is not valid" });
      }



      // Update user with new encrypted password
      Admin.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { adminToken: admin.adminToken }

      }).then(
        emailservice.PasswordResetSuccess(admin.email, 'Password Changed Successfully')
      )

      return res.status(200).send({ message: "Password Changed successfully" });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const passwordreset = async (req, res) => {
  //console.log(req);
  Admin.findOne({
    where: {
      resetToken: req.body.resetToken
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(404).send({ message: "User is not valid" });
      }


      // Update user with new encrypted password
      Admin.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { adminToken: req.body.id }

      }).then(
        emailservice.PasswordResetSuccess(admin.email, 'Password Changed Successfull')
      )

      return res.status(200).send({ message: "Password reset successfull" });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

// update professional
const updateAdmin = async (req, res) => {
  Admin.update(
    {
      photo: req.body.photo,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    },
    {
      where: {
        adminToken: req.body.adminToken
      }
    }
  )
    .then(rowsAffected => {
      if (rowsAffected[0] === 0) {
        return res.status(404).send({
          message: "admin not found with token " + req.body.adminToken
        });
      }
      res.send({
        message: "admin was updated successfully." + req.body.adminToken,


      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the admin."
      });
    });
};


const createAdminInfo = async (req, res) => {
  const { adminToken } = req.body;

  if (!adminToken) {
    return res.status(400).send({
      message: "adminToken is required in the request body."
    });
  }

  try {
    const admin = await db.admin.findOne({
      where: { adminToken }
    });

    if (!admin) {
      return res.status(400).send({
        message: `No adminToken found with token: ${adminToken}.`
      });
    }
    // if (req.body.aadharNumber.toString().length !== 16) {
    //   return res.status(400).send({
    //     message: "Aadhar number must be 16 digits long."
    //   });
    // }

    const admininfo = await db.admininfo.create({
      age: req.body.age,
      gender: req.body.gender,
      shortDescription: req.body.shortDescription,
      activationDate: req.body.activationDate,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      adminId: admin.id
    }, {
      include: [{
        model: db.admin,
        attributes: ['adminToken',]
      }],
      attributes: { exclude: ['id', 'adminId', 'updatedAt', 'createdAt'] }
    });

    // Change the attributes option to include the token field from the professional model
    const admininfoWithToken = await db.admininfo.findByPk(admininfo.id, {
      include: [{
        model: db.admin,
        attributes: ['adminToken',]
      }],
      attributes: { exclude: ['id', 'adminId', 'updatedAt', 'createdAt'] }
    });

    if (!admininfoWithToken) {
      return res.status(400).send({
        message: "admin information could not be created."
      });
    }

    res.send({
      message: "admin information created successfully.",
      admininfo: admininfoWithToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while creating the admin information."
    });
  }
};

// update admininfo
const updateAdminInfo = async (req, res) => {
  const { adminToken } = req.body;

  if (!adminToken) {
    return res.status(400).send({
      message: "adminToken is required in the request body."
    });
  }

  try {
    const admin = await db.admin.findOne({
      where: { adminToken }
    });

    if (!admin) {
      return res.status(400).send({
        message: "No admin found with the provided adminToken."
      });
    }
    db.admininfo.update({
      age: req.body.age,
      gender: req.body.gender,
      shortDescription: req.body.shortDescription,
      activationDate: req.body.activationDate,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      adminId: admin.id
    },
      { where: { id: admin.id } }
    );

    if (!Admininfo) {
      return res.status(400).send({
        message: "admin information could not be updated."
      });
    }

    res.send({
      message: "admin information updated successfully.",
      adminToken: adminToken
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating the professional information."
    });
  }
};
const getOneAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
    });

    if (!admin) {
      return res.status(404).send({
        message: 'User not found with adminToken',
      });
    }

    const { email, adminToken, photo, firstName, lastName } = admin;
    const fullName = `${firstName} ${lastName}`;

    res.status(200).send({
      fullName,
      photo,
      email,
      adminToken,
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error retrieving admin with adminToken',
    });
  }
};


module.exports = {
  register,
  login,
  userregister,
  //professional password
  forgotpassword,
  resetpassword,
  passwordreset,
  updateAdmin,
  createAdminInfo,
  updateAdminInfo,
  getOneAdmin,
  getAllUser,
  rejectuser,
  approveuser,
  getallorders,

}
