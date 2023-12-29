const db = require("../../models");
const config = require("../../config/auth.config");
const { user, Sequelize } = require("../../models/index");
const User = db.user;
const Status = db.status;
const Userinfo = db.userinfo;
const Professional = db.professional;
const sequelize = db.sequelize;
const Profile = db.profile;
const Admin = db.admin;
const Bankprofile = db.bankdetail;
const Profbooking = db.profbooking;
const Slot = db.slot;
const Op = db.Sequelize.Op;
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

// Example usage
// const id = generateUniqueId();
// console.log(id);

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
  const resultString = `O${formattedHour}${formattedMonth}${formattedRandomDigits}`;

  return resultString;
}


function concatDataValues(profile, bankdetails) {
  // Extract the dataValues from each dictionary
  const profileData = profile.dataValues || {};
  const bankDetailsData = bankdetails.dataValues || {};

  // Concatenate the dataValues
  const concatenatedDataValues = { ...profileData, ...bankDetailsData };

  return concatenatedDataValues;
}

// Create a user
const register = async (req, res) => {
  const checkuser = await User.findOne({
    where: {
      email: req.body.email
    }
  });

  // console.log(checkuser)
  if (checkuser) {
    return res.status(404).send({ message: "User Already exist." });
  }


  const clinic_id = generateString();

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

    const statusDesc = await db.statusdesc.findOne({
      where: { statuscode: "WA4000" },
    });
    const newUser = await db.user.create(user);

    user.userId = newUser.id;

    const newprofile = await db.profile.create(user);
    // Find the statusdesc with statuscode "ww4000"


    const newbankprofile = await Bankprofile.create(user);

    const newdesc = await db.userdesc.create(user);

    // Associate the user with the statusdesc
    if (statusDesc) {
      await newUser.addStatusdesc(statusDesc);
    }

    const result = {
      clinicName: newUser.clinicName,
      address: newUser.clinicName,
      phonenumber: newUser.phonenumber,
      email: newUser.email,
      password: newUser.password,
      userToken: newUser.userToken,
      statusdesc: [{ statuscode: statusDesc.statuscode, description: statusDesc.description }],
    };

    emailservice.userregistermail(user.email, user.clinicName, user.clinicid, user.address, user.phonenumber);

    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while creating user.",
    });
  }
};


// user login
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const accessToken = jwt.sign({ id: user.userToken }, config.secret, {
      expiresIn: "1d"
    });

    const fullName = `${user.clinicName}`;
    const status = `${user.status}`

    res.status(200).send({
      userToken: user.userToken,
      accessToken,
      fullName, status,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};




const getstatus = async (req, res) => {

  try {
    const user = await User.findOne({
      where: { userToken: req.body.userToken },
    });

    //   console.log(doctor)
    const { email, userToken, clinicName, status } = user;
    const clinicname = `${clinicName}`;

    res.status(200).send({
      clinicname,
      email,
      userToken, status
    });
  }
  catch (err) {
    res.status(500).send({
      message: 'Error retrieving status with userToken',
    });
  }


};


const forgotpassword = async (req, res) => {

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Email not exists." });
      } else {

        const resetToken = tokgen2.generate();

        User.update({ resetToken: resetToken }, {
          where: { userToken: user.userToken }

        }).then(
          emailservice.sendResetPasswordEmail(user.email, resetToken)
        )

        return res.status(200).send({ message: "Reset link send to the registered email id" });

      }

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const resetpassword = async (req, res) => {

  User.findOne({
    where: {
      resetToken: req.body.resetToken
    }
  })
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "The reset link is not valid" });
      }



      // Update user with new encrypted password
      User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { userToken: user.userToken }

      }).then(
        emailservice.PasswordResetSuccess(user.email, 'Password Changed Successfully')
      )

      return res.status(200).send({ message: "Password Changed successfully" });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const passwordreset = async (req, res) => {
  console.log(req);
  User.findOne({
    where: {
      resetToken: req.body.resetToken,
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User is not valid" });
      }


      // Update user with new encrypted password
      User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { userToken: req.body.id }

      }).then(
        emailservice.PasswordResetSuccess(user.email, 'Password Changed Successfully')
      )

      return res.status(200).send({ message: "Password reset successfully" });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};
//const conformpassword = async (req, res) => {
const allRegisterUser = async (req, res) => {
  User.findAndCountAll({
    attributes: { exclude: ['password', 'id', 'resetToken', 'createdAt', 'updatedAt'] }
  })
    .then(data => {
      console.log(data);
      res.send({
        count: data.count,
        users: data.rows
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
}



const getAllUser = async (req, res) => {
  const admin = await Admin.findOne({
    where: { adminToken: req.body.adminToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!admin) {
    return res.status(404).send({
      message: "Admin not found with token " + req.body.adminToken
    });
  }
  User.findAll({
    include: [
      {
        model: Userinfo,
        as: 'userDetail',
        where: { userId: Sequelize.col('User.id') }

      }
    ]
  })
    .then(users => {
      if (!users) {
        return res.status(404).send({
          message: 'Users not found'
        });
      }

      const formattedUsers = users.map(user => {
        const userDetail = user.userDetail;
        const fullName = `${user.firstName} ${user.lastName}`;

        return {
          fullName,
          photo: user.photo,
          email: user.email,
          userToken: user.userToken,
          mobileNumber: userDetail.mobileNumber,
          address: userDetail.address,
          activeInd: userDetail.activeInd,

        };
      });


      res.status(200).send(formattedUsers);
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Users'
      });
    });
};

// const getOneUser = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: { userToken: req.body.userToken },
//     });

//     const stat = await Status.findOne({
//       where: {
//         clinicid: user.clinicid
//       }
//     });

//     const profileo = await Profile.findOne({
//       where: { clinicid: user.clinicid }
//     });
//     const bankprofile = await Bankprofile.findOne({
//       where: { clinicid: user.clinicid }
//     });
//     const profile = concatDataValues(profileo, bankprofile);

//     if (!user) {
//       return res.status(404).send({
//         message: 'User not found with userToken',
//       });
//     }

//     const { email, userToken, photo, clinicName } = user;
//     const clinicname = `${clinicName}`;
//     const { statuscode, description } = stat;
//     res.status(200).send({
//       clinicname, profile,
//       photo,
//       email,
//       userToken, statuscode, description
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: 'Error retrieving User with userToken',
//     });
//   }
// };

const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userToken: req.body.userToken },
      include: [
        {
          model: db.statusdesc,
          as: 'statusdesc',
          attributes: ['statuscode', 'description'],
          through: { model: User.sequelize.models.userstatusdesc, as: 'userstatusdesc' },
        },
        {
          model: db.profile,
          as: 'profileuser',
          attributes: ["image", "clinicid", "clinicName", "email", "address", "phonenumber", "city", "alternativenumber", "state", "pincode", "country"],
        },
        {
          model: db.bankdetail,
          as: 'bankdetailuser',
          attributes: ["bankacnumber", "ifsc", "bankbranch", "upiid", "gst"],
        },
        {
          model: db.userdesc,
          as: 'userdesc',
          attributes: ["description"],
        }
      ],
    });

    const doctor = await db.doctor.findAll({
      where: { clinicid: user.clinicid }
    });
    if (doctor.length > 0) {
      var doctor_count = true;
    } else {
      var doctor_count = false;
    };




    // console.log(user.profileuser)
    if (!user) {
      return res.status(404).send({
        message: 'User not found with userToken',
      });
    }

    const { id, email, userToken, clinicName } = user;
    const clinicname = `${clinicName}`;
    const { statuscode } = user.statusdesc;
    var userDetail = user.statusdesc;
    var profile = concatDataValues(user.profileuser, user.bankdetailuser);
    var userDesc = user.userdesc;


    // Using the alias 'statusdesc->userstatusdesc' to access the associated data
    // const userStatusDesc = user['statusdesc->userstatusdesc'];
    // console.log(userStatusDesc)

    // if (!userStatusDesc) {
    //   return res.status(404).send({
    //     message: 'UserStatusDesc not found for the user',
    //   });
    // }

    // const { statusdesc } = userStatusDesc;
    // const { statuscode, description } = statusdesc;

    res.status(200).send({
      clinicname,
      email,
      userToken,
      userDetail,
      profile,
      userDesc,
      doctor_count,
      // statuscode,
      // description,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Error retrieving User with userToken',
    });
  }
};


const getOneUserAdmin = async (req, res) => {
  const admin = await Admin.findOne({
    where: { adminToken: req.body.adminToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!admin) {
    return res.status(404).send({
      message: "Admin not found with token " + req.body.adminToken
    });
  }
  User.findOne({
    where: { userToken: req.body.userToken },
    include: [
      {
        model: Userinfo,
        as: 'userDetail'
      }
    ]
  })
    .then(User => {
      if (!User) {
        return res.status(404).send({
          message: 'User not found with userToken 1'
        });
      }

      const { email, userToken, photo } = User;
      const userDetail = User.userDetail;
      const fullName = `${User.firstName} ${User.lastName}`;

      res.status(200).send({
        fullName,
        photo,
        email,
        userToken,
        mobileNumber: userDetail.mobileNumber,
        address: userDetail.address,
        activeInd: userDetail.activeInd
      });
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving User with userToken '
      });
    });

}

const createuserinfo = async (req, res) => {
  User.findOne({
    where: {
      userToken: req.body.userToken
    }
  })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: "User not found with given token"
        });
      }
      const userId = user.id;
      Userinfo.findOne({
        where: {
          userId: userId
        }
      })
        .then(userInfo => {
          if (userInfo) {
            return res.status(400).send({
              message: "Userinfo already exists for the given User."
            });
          }
          Userinfo.create({
            userId: userId,
            mobileNumber: req.body.mobileNumber,
            address: req.body.address
          })
            .then(createdUserInfo => {
              const response = {
                userToken: user.userToken,
                activeInd: createdUserInfo.activeInd,
                mobileNumber: createdUserInfo.mobileNumber,
                address: createdUserInfo.address,
              };
              res.send(response);
            })
            .catch(err => {
              res.status(500).send({
                message: err.message || "Some error occurred while creating the Userinfo."
              });
            });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving the Userinfo."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the User."
      });
    });
};

const updateuserinfo = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        userToken: req.body.userToken
      }
    });
    if (!user) {
      return res.status(401).send({
        message: "User not found with given token"
      });
    }

    const userId = user.id;
    let userInfo = await Userinfo.findOne({
      where: {
        userId: userId
      }
    });

    if (!userInfo) {
      return res.status(404).send({
        message: "Userinfo not found for the given User."
      });
    }

    userInfo = await userInfo.update({

      mobileNumber: req.body.mobileNumber,
      address: req.body.address
    });

    const response = {
      userToken: req.body.userToken,
      activeInd: userInfo.activeInd,
      mobileNumber: userInfo.mobileNumber,
      address: userInfo.address,
    };
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating the Userinfo."
    });
  }
};

const updateUser = async (req, res) => {
  User.update(

    {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    },
    {
      where: {
        userToken: req.body.userToken
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


// admin confirm cancel user
const adminCancelUser = async (req, res) => {
  const user = await User.findOne({
    where: { userToken: req.body.userToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!user) {
    return res.status(404).send({
      message: "User info not found with userToken " + req.body.userToken
    });
  }

  const admin = await Admin.findOne({
    where: { adminToken: req.body.adminToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!admin) {
    return res.status(404).send({
      message: "Admin not found with token " + req.body.adminToken
    });
  }

  User.update(
    {
      activeInd: req.body.activeInd,
    },
    {
      where: {
        id: user.id,
      },
    }
  ).then((data) => {
    console.log(data);
    // Only include the necessary fields in the response
    const responseData = {
      message: 'user cancel successfully',
      userToken: user.userToken,
      adminToken: admin.adminToken,
    };
    res.send(responseData);
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating user.',
    });
  });
}


// Only count user with activeInd set to 1
const allUserCount = async (req, res) => {
  try {
    const userCount = await User.count({
      where: {
        activeInd: 1
      }
    });
    res.send({ userCount });
  } catch (err) {
    res.status(500).send({
      message: "Error occurred while retrieving user count: " + err.message
    });
  }
};

module.exports = {

  register,
  login,
  forgotpassword,
  resetpassword,
  passwordreset,
  allRegisterUser,
  getAllUser,
  getOneUser,
  getOneUserAdmin,
  createuserinfo,
  updateuserinfo,
  updateUser,
  adminCancelUser,
  allUserCount,
  getstatus

};