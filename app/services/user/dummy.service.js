const db = require("../../models");
const config = require("../../config/auth.config");
const { professional, sequelize } = require("../../models/index");
const Professional = db.professional;
const categorie = db.categorie;
const Professionalinfo = db.professionalinfo;
const profqualifie = db.profqualifie;
const User = db.user;
const Admin = db.admin;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const emailservice = require('../../services/email.service');

// register professional
const register = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }

    const professional = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        token: tokgen2.generate(),
    };

    try {
        // Save professional in the database
        const newProfessional = await Professional.create(professional);

        // Exclude the specified fields from the output
        const result = {
            fullName: newProfessional.firstName + ' ' + newProfessional.lastName,
            email: newProfessional.email,
            password: newProfessional.password,
            token: newProfessional.token,

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
    Professional.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(professional => {
            if (!professional) {
                return res.status(404).send({ message: "professional Not found." });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                professional.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({ id: professional.token }, config.secret, {
                expiresIn: 86400 // 24 hours
            });
            var refreshtoken = jwt.sign({ id: professional.token }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var fullName = `${professional.firstName} ${professional.lastName}`; // concatenate first name and last name

            res.status(200).send({
                accessToken: token,
                refreshtoken: refreshtoken,
                token: professional.token,
                fullName: fullName
            });

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};

const forgotpassword = async (req, res) => {

    Professional.findOne({
        where: {
            email: req.body.email,
            token: professional.token
        }
    })
        .then(professional => {
            if (!professional) {
                return res.status(404).send({ message: "Email not exists." });
            } else {

                const resetToken = tokgen2.generate();

                Professional.update({ resetToken: resetToken }, {
                    where: { token: professional.token }

                }).then(
                    emailservice.sendResetPasswordEmail(professional.email, resetToken)
                )

                return res.status(200).send({ message: "Reset link send to the registered email id" });

            }

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};

const resetpassword = async (req, res) => {

    Professional.findOne({
        where: {
            resetToken: req.body.resetToken
        }
    })
        .then(professional => {
            console.log(professional);
            if (!professional) {
                return res.status(404).send({ message: "The reset link is not valid" });
            }



            // Update user with new encrypted password
            Professional.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
                where: { token: professional.token }

            }).then(
                emailservice.PasswordResetSuccess(professional.email, 'Password Changed Successfully')
            )

            return res.status(200).send({ message: "Password Changed successfully" });

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};

const passwordreset = async (req, res) => {
    //console.log(req);
    Professional.findOne({
        where: {
            resetToken: req.body.resetToken
        }
    })
        .then(professional => {
            if (!professional) {
                return res.status(404).send({ message: "User is not valid" });
            }


            // Update user with new encrypted password
            Professional.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
                where: { token: req.body.id }

            }).then(
                emailservice.PasswordResetSuccess(professional.email, 'Password Changed Successfully')
            )

            return res.status(200).send({ message: "Password reset successfully" });

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });

};



//call stored procedure(call booking "booking","professional shiftslot")
const getonebookingschedule = async (req, res) => {
    sequelize.query('CALL booking(:token, :BookDate);',
        {
            replacements: {
                token: req.body.i_token,
                BookDate: req.body.i_current_date

            }
        })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `error data not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });
};

const createProfCategory = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    const professional = await Professional.findOne({ where: { token: req.body.token } });
    // If the professional is not found return an error response 
    if (!professional) {
        return res.status(404).send({
            message: "Professional not found with token " + req.body.token
        });
    }
    const existingCategory = await db.categorie.findOne({
        where: {
            categorieName: req.body.categorieName,
            categorieCode: req.body.categorieCode,

        }
    });
    // If a category with the given name and code already exists, associate it with the professional
    if (existingCategory) {
        await professional.addCategorie(existingCategory);
        // exclude specific attributes
        const categorie = {
            categorieName: existingCategory.categorieName,
            categorieCode: existingCategory.categorieCode,
            token: professional.token
        }
        return res.send(categorie);
    }
    // If the category does not exist, create a new one and associate it with the professional
    const categorie = await db.categorie.create({
        categorieName: req.body.categorieName,
        categorieCode: req.body.categorieCode,

    });
    // exclude specific attributes
    const newCategorie = {
        categorieName: categorie.categorieName,
        categorieCode: categorie.categorieCode,
        token: professional.token,
        adminToken: admin.adminToken,
        photo: professional.photo
    }
    await professional.addCategorie(categorie);
    res.send(newCategorie);
};



//update professional category

async function updateProfCategory(req, res) {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    const token = req.body.token;
    // Find the professional based on the token
    const professional = await db.professional.findOne({
        where: {
            token: token
        }
    });

    // Find the association between the professional and categorie
    const professionalCategorie = await db.professional.findOne({

        include: [{
            model: db.categorie,
            as: "categorie"
        }]
    });

    // Check if the association was found
    if (!professionalCategorie) {
        return res.status(400).json({
            message: "Error updating categorie",
            error: "Association between professional and categorie not found"
        });
    }

    // Check if the categorieCode and categorieName already exist in the categorie table
    const existingCategorie = await db.categorie.findOne({
        where: {
            categorieCode: req.body.categorieCode,
            categorieName: req.body.categorieName
        }
    });

    // If the categorieCode and categorieName already exist, update the association with the existing categorie id
    if (existingCategorie) {
        professionalCategorie.categorieId = existingCategorie.id;
    } else {
        // If the categorieCode and categorieName do not exist, create a new categorie and update the association with the new categorie id
        const newCategorie = await db.categorie.create({
            categorieCode: req.body.categorieCode,
            categorieName: req.body.categorieName
        });

        professionalCategorie.categorieId = newCategorie.id;
    }

    // Save the changes to the association
    await professionalCategorie.save();

    // Return a success response
    return res.status(200).json({
        message: "Categorie updated successfully",
        token: token,
        adminToken: admin.adminToken
    });
}

//get all professionals registeruser
const userGetAllProfessional = async (req, res) => {
    const user = await User.findOne({
        where: { userToken: req.body.userToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) {
        return res.status(404).send({
            message: "user not found with token " + req.body.userToken
        });
    }
    Professional.findAll({
        attributes: { exclude: ["categorieCode", "activeInd", "professionalCategorieLT", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "longDescription", "address", 'id', "activationDate", "name", "email", "password", "resetToken", 'professionalId', 'createdAt', 'updatedAt', 'activationDate', "categoryId", 'activeInd'] },
        include: [
            {
                model: Professionalinfo,
                as: 'professionalDetail',
                attributes: ['gender', 'shortDescription']
            },
            {
                model: categorie,
                as: 'categorie',
                attributes: ['categorieCode', 'categorieName', 'activeInd'],
            },
            {
                model: profqualifie,
                as: 'qualification',
                attributes: ['qualificationName', 'instituteName', 'startYear'],
            }

        ]
    })
        .then(data => {
            console.log(data)
            const transformedData = data.map(item => {
                const { firstName, lastName, token, categorie, photo, qualification, professionalDetail } = item;
                const catDetails = categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }));
                return {
                    name: firstName + ' ' + lastName,
                    token,
                    photo,
                    professionalDetail,
                    qualification,
                    categorieDetails: catDetails

                };
            });

            res.status(200).send(transformedData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};

//get all professionals registeruser
const getallprofessional = async (req, res) => {
    Professional.findAll({
        attributes: { exclude: ["categorieCode", "activeInd", "professionalCategorieLT", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "longDescription", "address", 'id', "activationDate", "name", "email", "password", "resetToken", 'professionalId', 'createdAt', 'updatedAt', 'activationDate', "categoryId", 'activeInd'] },
        include: [
            {
                model: Professionalinfo,
                as: 'professionalDetail',
                attributes: ['gender', 'shortDescription']
            },
            {
                model: categorie,
                as: 'categorie',
                attributes: ['categorieCode', 'categorieName', 'activeInd'],
            },
            {
                model: profqualifie,
                as: 'qualification',
                attributes: ['qualificationName', 'instituteName', 'startYear'],
            }
        ],
        limit: 10 // Limit the result to 10 professionals
    })
        .then(data => {
            console.log(data)
            const transformedData = data.map(item => {
                const { firstName, lastName, token, categorie, photo, qualification, professionalDetail } = item;
                const catDetails = categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }));
                return {
                    name: firstName + ' ' + lastName,
                    token,
                    photo,
                    professionalDetail,
                    qualification,
                    categorieDetails: catDetails
                };
            });
            res.status(200).send(transformedData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};

//get all professionals for admin
const getallprofessionalAdmin = async (req, res) => {
    // const admin = await Admin.findOne({
    //   where: { adminToken: req.body.adminToken } ,
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    // });
    // if (!admin) {
    //   return res.status(404).send({
    //     message: "Admin not found with token " + req.body.adminToken
    //   });
    // }
    Professional.findAll({
        attributes: { exclude: ["categorieCode", "activeInd", "professionalCategorieLT", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "longDescription", "address", 'id', "activationDate", "name", "email", "password", "resetToken", 'professionalId', 'createdAt', 'updatedAt', 'activationDate', "categoryId", 'activeInd'] },
        include: [
            {
                model: Professionalinfo,
                as: 'professionalDetail',
                attributes: ['gender', 'shortDescription']
            },
            {
                model: categorie,
                as: 'categorie',
                attributes: ['categorieCode', 'categorieName', 'activeInd'],
            },
            {
                model: profqualifie,
                as: 'qualification',
                attributes: ['qualificationName', 'instituteName', 'startYear'],
            }

        ]
    })
        .then(data => {
            console.log(data)
            const transformedData = data.map(item => {
                const { firstName, lastName, token, categorie, photo, qualification, professionalDetail } = item;
                const catDetails = categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }));
                return {
                    name: firstName + ' ' + lastName,
                    token,
                    photo,
                    professionalDetail,
                    qualification,
                    categorieDetails: catDetails

                };
            });

            res.status(200).send(transformedData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};

const getOneProfessional = async (req, res) => {
    const user = await User.findOne({
        where: { userToken: req.body.userToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) {
        return res.status(404).send({
            message: "user not found with token " + req.body.userToken
        });
    }
    Professional.findOne({
        where: { token: req.body.token },
        attributes: { exclude: ["activeInd", "professionalCategorieLT", "instituteName", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "id", "activationDate", "name", "email", "password", "resetToken", "professionalId", "createdAt", "updatedAt", "activationDate", "categoryId", "activeInd"] },
        include: [
            {
                model: Professionalinfo,
                as: "professionalDetail",
                attributes: ["gender", "shortDescription", "longDescription", "address"]
            },
            {
                model: categorie,
                as: "categorie",
                attributes: ["categorieCode", "categorieName", "activeInd"]
            },
            {
                model: profqualifie,
                as: "qualification",
                attributes: ["qualificationName", "startYear"]
            }
        ]
    })
        .then(data => {
            let qualifications = [];
            if (Array.isArray(data.qualification)) {
                qualifications = data.qualification.map(qualification => {
                    return {
                        qualificationName: qualification.qualificationName,
                        instituteName: qualification.instituteName,
                        startYear: qualification.startYear
                    };
                });
            } else {
                qualifications = [
                    {
                        qualificationName: data.qualification.qualificationName,
                        instituteName: data.qualification.instituteName,
                        startYear: data.qualification.startYear
                    }
                ];
            }
            res.status(200).send({
                name: data.firstName + " " + data.lastName,
                token: data.token,
                photo: data.photo,
                professionalDetail: data.professionalDetail,
                qualification: qualifications,
                categorie: Array.isArray(data.categorie)
                    ? data.categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }))
                    : { categorieName: data.categorie.categorieName, categorieCode: data.categorie.categorieCode }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};
//get one professional for unregister user
const getOneProfessionalUnRegisterUser = async (req, res) => {
    Professional.findOne({
        where: { token: req.body.token },
        attributes: { exclude: ["activeInd", "professionalCategorieLT", "instituteName", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "id", "activationDate", "name", "email", "password", "resetToken", "professionalId", "createdAt", "updatedAt", "activationDate", "categoryId", "activeInd"] },
        include: [
            {
                model: Professionalinfo,
                as: "professionalDetail",
                attributes: ["gender", "shortDescription", "longDescription", "address"]
            },
            {
                model: categorie,
                as: "categorie",
                attributes: ["categorieCode", "categorieName", "activeInd"]
            },
            {
                model: profqualifie,
                as: "qualification",
                attributes: ["qualificationName", "startYear"]
            }
        ]
    })
        .then(data => {
            let qualifications = [];
            if (Array.isArray(data.qualification)) {
                qualifications = data.qualification.map(qualification => {
                    return {
                        qualificationName: qualification.qualificationName,
                        instituteName: qualification.instituteName,
                        startYear: qualification.startYear
                    };
                });
            } else {
                qualifications = [
                    {
                        qualificationName: data.qualification.qualificationName,
                        instituteName: data.qualification.instituteName,
                        startYear: data.qualification.startYear
                    }
                ];
            }
            res.status(200).send({
                name: data.firstName + " " + data.lastName,
                token: data.token,
                photo: data.photo,
                professionalDetail: data.professionalDetail,
                qualification: qualifications,
                categorie: Array.isArray(data.categorie)
                    ? data.categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }))
                    : { categorieName: data.categorie.categorieName, categorieCode: data.categorie.categorieCode }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};
const getProfessional = async (req, res) => {
    // const user = await User.findOne({
    //   where: {userToken: req.body.userToken } ,
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    // });
    // if (!user) {
    //   return res.status(404).send({
    //     message: "user not found with token " + req.body.userToken
    //   });
    // }
    Professional.findOne({
        where: { token: req.body.token },
        attributes: { exclude: ["activeInd", "professionalCategorieLT", "instituteName", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "id", "activationDate", "name", "password", "resetToken", "professionalId", "createdAt", "updatedAt", "activationDate", "categoryId", "activeInd"] },
        include: [
            {
                model: Professionalinfo,
                as: "professionalDetail",
                attributes: ["gender", "shortDescription", "longDescription", "address"]
            },
            {
                model: categorie,
                as: "categorie",
                attributes: ["categorieCode", "categorieName", "activeInd"]
            },
            {
                model: profqualifie,
                as: "qualification",
                attributes: ["qualificationName", "startYear"]
            }
        ]
    })
        .then(data => {
            let qualifications = [];
            if (Array.isArray(data.qualification)) {
                qualifications = data.qualification.map(qualification => {
                    return {
                        qualificationName: qualification.qualificationName,
                        instituteName: qualification.instituteName,
                        startYear: qualification.startYear
                    };
                });
            } else {
                qualifications = [
                    {
                        qualificationName: data.qualification.qualificationName,
                        instituteName: data.qualification.instituteName,
                        startYear: data.qualification.startYear
                    }
                ];
            }
            res.status(200).send({
                name: data.firstName + " " + data.lastName,
                token: data.token,
                photo: data.photo,
                email: data.email,
                professionalDetail: data.professionalDetail,
                qualification: qualifications,
                categorie: Array.isArray(data.categorie)
                    ? data.categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }))
                    : { categorieName: data.categorie.categorieName, categorieCode: data.categorie.categorieCode }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};

const getOneProfessionalAdmin = async (req, res) => {
    Professional.findOne({
        where: { token: req.body.token },
        attributes: { exclude: ["activeInd", "professionalCategorieLT", "instituteName", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "id", "activationDate", "name", "email", "password", "resetToken", "professionalId", "createdAt", "updatedAt", "activationDate", "categoryId", "activeInd"] },
        include: [
            {
                model: Professionalinfo,
                as: "professionalDetail",
                attributes: ["gender", "shortDescription", "longDescription", "address"]
            },
            {
                model: categorie,
                as: "categorie",
                attributes: ["categorieCode", "categorieName", "activeInd"]
            },
            {
                model: profqualifie,
                as: "qualification",
                attributes: ["qualificationName", "startYear"]
            }
        ]
    })
        .then(data => {
            let qualifications = [];
            if (Array.isArray(data.qualification)) {
                qualifications = data.qualification.map(qualification => {
                    return {
                        qualificationName: qualification.qualificationName,
                        instituteName: qualification.instituteName,
                        startYear: qualification.startYear
                    };

                });
            } else {
                qualifications = [
                    {
                        qualificationName: data.qualification.qualificationName,
                        instituteName: data.qualification.instituteName,
                        startYear: data.qualification.startYear
                    }
                ];
            }
            res.status(200).send({
                name: data.firstName + " " + data.lastName,
                token: data.token,
                photo: data.photo,
                professionalDetail: data.professionalDetail,
                qualification: qualifications,
                categorie: Array.isArray(data.categorie)
                    ? data.categorie.map(cat => ({ categorieName: cat.categorieName, categorieCode: cat.categorieCode }))
                    : { categorieName: data.categorie.categorieName, categorieCode: data.categorie.categorieCode }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: "Error retrieving professional details." });
        });
};


// update professional
const updateProfessional = async (req, res) => {
    Professional.update(
        {
            photo: req.body.photo,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        {
            where: {
                token: req.body.token
            }
        }
    )
        .then(rowsAffected => {
            if (rowsAffected[0] === 0) {
                return res.status(404).send({
                    message: "Professional not found with token " + req.body.token
                });
            }
            res.send({
                message: "Professional was updated successfully." + req.body.token,


            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the professional."
            });
        });
};

const updateProfessionalAdmin = async (req, res) => {
    Professional.update(
        {
            photo: req.body.photo,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        {
            where: {
                token: req.body.token
            }
        }
    )
        .then(rowsAffected => {
            if (rowsAffected[0] === 0) {
                return res.status(404).send({
                    message: "Professional not found with token " + req.body.token
                });
            }
            res.send({
                message: "Professional was updated successfully." + req.body.token,


            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while updating the professional."
            });
        });
};




const getAllCategory = async (req, res) => {
    categorie.findAll({
        attributes: { exclude: ["activeInd", "professionalCategorieLT", "createdAt", "updatedAt", "professionalId", "categorieId", "age", "aadharNumber", "panNumber", "mobileNumber", "longDescription", "address", 'id', "activationDate", "name", "email", "password", "resetToken", 'professionalId', 'createdAt', 'updatedAt', 'activationDate', "categoryId", 'activeInd'] },
        where: { activeInd: 1 },
        include: [
            {
                model: Professionalinfo,
                as: 'professionalDetail',
                attributes: ['gender', 'shortDescription']
            },
            {
                model: Professional,
                as: 'Professionals',
                attributes: ['firstName', 'lastName', 'token', "photo"],
            }

        ]
    })
        .then(data => {
            res.status(200).send({
                categories: data.map(category => {
                    const professionals = category.Professionals.map(prof => {
                        return {
                            name: `${prof.firstName} ${prof.lastName}`,
                            token: prof.token,
                            photo: prof.photo,
                            professionalDetail: category.professionalDetail
                        };
                    });
                    return {
                        categorieName: category.categorieName,
                        categorieCode: category.categorieCode,
                        professionals
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
};
//categorie code given unregister user
const getOneProfCategoryUnRegisterUser = async (req, res) => {
    try {
        const { categorieCode } = req.body;

        // Find the category with the given categorieCode
        const category = await db.categorie.findOne({
            where: { categorieCode },
            include: [
                {
                    model: db.professional,
                    as: 'Professionals',
                    attributes: ['id', 'firstName', 'lastName', 'photo', 'token'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.profqualifie,
                            as: 'qualification',
                            attributes: ['qualificationName', 'instituteName', 'startYear']
                        }
                    ]
                }
            ]
        });

        // If the category does not exist, return a 404 error
        if (!category) {
            return res.status(404).send({ error: `Category with code ${categorieCode} not found` });
        }

        // Map the professionals to a simpler format and return
        const professionals = category.Professionals ? await Promise.all(category.Professionals.map(async prof => {
            const professional = await Professional.findByPk(prof.id, {
                attributes: ['id'],
                include: [
                    {
                        model: profqualifie,
                        as: 'qualification',
                        attributes: ['qualificationName', 'instituteName', 'startYear'],
                        where: { professionalId: prof.id }
                    }
                ]
            });
            return {
                name: `${prof.firstName} ${prof.lastName}`,
                token: prof.token,
                photo: prof.photo,
                categorie: [category.categorieName, category.categorieCode],
                qualification: professional.qualification
            };
        })) : [];

        res.status(200).send({ professionals });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error retrieving professional details." });
    }
};


// register user can find all the pofessional
const getOneProfCategory = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { userToken: req.body.userToken },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        if (!user) {
            return res.status(404).send({
                message: "User info not found with userToken " + req.body.userToken
            });
        }
        console.log(`req.body.categorieCode: ${req.body.categorieCode}`);
        const data = await categorie.findOne({
            where: { categorieCode: req.body.categorieCode },
            include: [
                {
                    model: Professional,
                    as: "Professionals",
                    attributes: ["id", "firstName", "lastName", "token", "photo"],
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: profqualifie,
                            as: 'qualification',
                            attributes: ['qualificationName', 'instituteName', 'startYear']
                        }
                    ]
                }
            ]
        });

        const professionals = data.Professionals ? await Promise.all(data.Professionals.map(async prof => {
            const professional = await Professional.findByPk(prof.id, {
                attributes: ['id'],
                include: [
                    {
                        model: profqualifie,
                        as: 'qualification',
                        attributes: ['qualificationName', 'instituteName', 'startYear'],
                        where: { professionalId: prof.id }
                    }
                ]
            });
            return {
                name: `${prof.firstName} ${prof.lastName}`,
                token: prof.token,
                photo: prof.photo,
                categorie: [data.categorieName, data.categorieCode],
                qualification: professional.qualification
            };
        })) : [];

        res.status(200).send({ professionals });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error retrieving professional details." });
    }
};


const getAllProfCategoryCount = async (req, res) => {
    try {
        const categories = await categorie.findAll();
        const professionals = await Professional.findAll({
            include: [
                {
                    model: categorie,
                    as: "categorie",
                    attributes: ['categorieName', 'categorieCode']
                },
                {
                    model: Professionalinfo,
                    as: "professionalDetail",
                    attributes: ['gender', 'shortDescription']
                },
                {
                    model: profqualifie,
                    as: "qualification",
                    attributes: ['qualificationName', 'instituteName', 'startYear']
                }
            ],
        });

        const categoryCounts = [];
        categories.forEach(category => {
            categoryCounts.push({
                categorieName: category.categorieName,
                categorieCode: category.categorieCode,
                count: 0
            });
        });
        professionals.forEach(professional => {
            professional.categorie.forEach(c => {
                const index = categoryCounts.findIndex(cc => cc.categorieName === c.categorieName);
                if (index >= 0) {
                    categoryCounts[index].count++;
                }
            });
        });

        const professionalCount = professionals.length;

        const formattedProfessionals = professionals.map(prof => {
            let categorieCode = null;
            let categorieName = null;
            if (prof.categorie && prof.categorie[0]) {
                categorieCode = prof.categorie[0].categorieCode;
                categorieName = prof.categorie[0].categorieName;
            }
            return {
                name: `${prof.firstName} ${prof.lastName}`,
                categorieCode,
                categorieName,
                professionalDetail: prof.professionalDetail,
                qualification: prof.qualification
            };
        });

        res.status(200).send({
            professionalCount,
            categoryCounts,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// update professionalinfo
const updateProfessionalinfo = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: "No professional found with the provided token."
            });
        }
        db.professionalinfo.update({
            age: req.body.age,
            gender: req.body.gender,
            shortDescription: req.body.shortDescription,
            activationDate: req.body.activationDate,
            longDescription: req.body.longDescription,
            address: req.body.address,
            mobileNumber: req.body.mobileNumber,
            professionalId: professional.id
        },
            { where: { id: professional.id } }
        );

        console.log(Professionalinfo);

        if (!Professionalinfo) {
            return res.status(400).send({
                message: "Professional information could not be updated."
            });
        }

        res.send({
            message: "Professional information updated successfully."
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the professional information."
        });

    }
};

// update professionalinfoAdmin
const updateProfessionalinfoAdmin = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: "No professional found with the provided token."
            });
        }
        db.professionalinfo.update({
            age: req.body.age,
            gender: req.body.gender,
            shortDescription: req.body.shortDescription,
            activationDate: req.body.activationDate,
            longDescription: req.body.longDescription,
            address: req.body.address,
            mobileNumber: req.body.mobileNumber,
            professionalId: professional.id
        },
            { where: { id: professional.id } }
        );

        console.log(Professionalinfo);

        if (!Professionalinfo) {
            return res.status(400).send({
                message: "Professional information could not be updated.",
                adminToken: admin.adminToken
            });
        }

        res.send({
            message: "Professional information updated successfully."
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the professional information."
        });

    }
};

const createProfessionalinfo = async (req, res) => {

    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: `No professional found with token: ${token}.`
            });
        }
        // if (req.body.aadharNumber.toString().length !== 16) {
        //   return res.status(400).send({
        //     message: "Aadhar number must be 16 digits long."
        //   });
        // }

        const existingProfessionalinfo = await db.professionalinfo.findOne({
            where: { professionalId: professional.id }
        });

        if (existingProfessionalinfo) {
            return res.status(400).send({
                message: `Professional info already exists for token: ${token}.`
            });
        }

        const professionalinfo = await db.professionalinfo.create({
            age: req.body.age,
            gender: req.body.gender,
            shortDescription: req.body.shortDescription,
            activationDate: req.body.activationDate,
            longDescription: req.body.longDescription,
            address: req.body.address,
            mobileNumber: req.body.mobileNumber,
            professionalId: professional.id
        }, {
            include: [{
                model: db.professional,
                attributes: ['token']
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        // Change the attributes option to include the token field from the professional model
        const professionalinfoWithToken = await db.professionalinfo.findByPk(professionalinfo.professionalId, {
            include: [{
                model: db.professional,
                attributes: ['token',]
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        if (!professionalinfoWithToken) {
            return res.status(400).send({
                message: "Professional information could not be created."
            });
        }

        res.send({
            message: "Professional information created successfully.",
            professionalinfo: professionalinfoWithToken,

        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Some error occurred while creating the professional information."
        });
    }
};

const createProfessionalinfoAdmin = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: `No professional found with token: ${token}.`
            });
        }
        // if (req.body.aadharNumber.toString().length !== 16) {
        //   return res.status(400).send({
        //     message: "Aadhar number must be 16 digits long."
        //   });
        // }

        const existingProfessionalinfo = await db.professionalinfo.findOne({
            where: { professionalId: professional.id }
        });

        if (existingProfessionalinfo) {
            return res.status(400).send({
                message: `Professional info already exists for token: ${token}.`
            });
        }

        const professionalinfo = await db.professionalinfo.create({
            age: req.body.age,
            gender: req.body.gender,
            shortDescription: req.body.shortDescription,
            activationDate: req.body.activationDate,
            longDescription: req.body.longDescription,
            address: req.body.address,
            mobileNumber: req.body.mobileNumber,
            professionalId: professional.id
        }, {
            include: [{
                model: db.professional,
                attributes: ['token']
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        // Change the attributes option to include the token field from the professional model
        const professionalinfoWithToken = await db.professionalinfo.findByPk(professionalinfo.professionalId, {
            include: [{
                model: db.professional,
                attributes: ['token',],
                professionalID: professional.id
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        // if (!professionalinfoWithToken) {
        //   return res.status(400).send({
        //     message: "Professional information could not be created."
        //   });
        // }

        res.send({
            message: "Professional information created successfully.",
            professionalinfo: professionalinfoWithToken,
            adminToken: admin.adminToken
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Some error occurred while creating the professional information."
        });
    }
};
// create profqualify for professional
const createProfQualify = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: `No professional found with token: ${token}.`
            });
        }
        // if (req.body.aadharNumber.toString().length !== 16) {
        //   return res.status(400).send({
        //     message: "Aadhar number must be 16 digits long."
        //   });
        // }

        const profqualifie = await db.profqualifie.create({
            qualificationName: req.body.qualificationName,
            instituteName: req.body.instituteName,
            startYear: req.body.startYear,
            professionalId: professional.id
        }, {
            include: [{
                model: db.professional,
                attributes: ['token']
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        // Change the attributes option to include the token field from the professional model
        const ProfqualifieWithToken = await db.profqualifie.findByPk(profqualifie.id, {
            include: [{
                model: db.professional,
                attributes: ['token']
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        if (!ProfqualifieWithToken) {
            return res.status(400).send({
                message: "Professional qualification could not be created."
            });
        }

        res.send({
            message: "Professional qualification created successfully.",
            Profqualifie: ProfqualifieWithToken
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Some error occurred while creating the professional information."
        });
    }
};
// update professionalinfo
const updateProfQualify = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: "No professional found with the provided token."
            });
        }
        db.profqualifie.update({
            qualificationName: req.body.qualificationName,
            instituteName: req.body.instituteName,
            startYear: req.body.startYear,
            professionalId: professional.id
        },
            { where: { id: professional.id } }
        );

        console.log(profqualifie);

        if (!profqualifie) {
            return res.status(400).send({
                message: "Professional qualification could not be updated."
            });
        }

        res.send({
            message: "Professional qualification updated successfully.",
            token: professional.token
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the professional information."
        });
    }
};

const createProfQualifyAdmin = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: `No professional found with token: ${token}.`
            });
        }
        // if (req.body.aadharNumber.toString().length !== 16) {
        //   return res.status(400).send({
        //     message: "Aadhar number must be 16 digits long."
        //   });
        // }

        const profqualifie = await db.profqualifie.create({
            qualificationName: req.body.qualificationName,
            instituteName: req.body.instituteName,
            startYear: req.body.startYear,
            professionalId: professional.id
        }, {
            include: [{
                model: db.professional,
                attributes: ['token']
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        // Change the attributes option to include the token field from the professional model
        const ProfqualifieWithToken = await db.profqualifie.findByPk(profqualifie.id, {
            include: [{
                model: db.professional,
                attributes: ['token']
            }],
            attributes: { exclude: ['id', 'professionalId', 'updatedAt', 'createdAt'] }
        });

        if (!ProfqualifieWithToken) {
            return res.status(400).send({
                message: "Professional qualification could not be created."
            });
        }

        res.send({
            message: "Professional qualification created successfully.",
            Profqualifie: ProfqualifieWithToken,
            adminToken: admin.adminToken,
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Some error occurred while creating the professional information."
        });
    }
};
// update professionalinfo
const updateProfQualifyAdmin = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({
            message: "Token is required in the request body."
        });
    }

    try {
        const professional = await db.professional.findOne({
            where: { token }
        });

        if (!professional) {
            return res.status(400).send({
                message: "No professional found with the provided token."
            });
        }
        db.profqualifie.update({
            qualificationName: req.body.qualificationName,
            instituteName: req.body.instituteName,
            startYear: req.body.startYear,
            professionalId: professional.id
        },
            { where: { id: professional.id } }
        );

        console.log(profqualifie);

        if (!profqualifie) {
            return res.status(400).send({
                message: "Professional qualification could not be updated."
            });
        }

        res.send({
            message: "Professional qualification updated successfully.",
            token: professional.token,
            adminToken: admin.adminToken
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while updating the professional information."
        });
    }
};

// admin confirm cancel professional
const adminCancelProf = async (req, res) => {
    const professional = await Professional.findOne({
        where: { token: req.body.token },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!professional) {
        return res.status(404).send({
            message: "User info not found with userToken " + req.body.token
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

    Professional.update(
        {
            activeInd: req.body.activeInd,
        },
        {
            where: {
                id: professional.id,
            },
        }
    ).then((data) => {
        console.log(data);
        // Only include the necessary fields in the response
        const responseData = {
            message: 'professional cancel successfully',
            token: professional.token,
            adminToken: admin.adminToken,
        };
        res.send(responseData);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating user.',
        });
    });
}

// Only count professionals with activeInd set to 1
const allProfessionalCount = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    try {
        const professionalCount = await Professional.count({
            where: {
                activeInd: 1
            }
        });
        res.send({ professionalCount });
    } catch (err) {
        res.status(500).send({
            message: "Error occurred while retrieving user count: " + err.message
        });
    }
};

const getAllCategoryDetail = async (req, res) => {
    const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
        return res.status(404).send({
            message: "Admin not found with token " + req.body.adminToken
        });
    }
    categorie.findAll({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'activeInd'] },
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
};
// professional history for admin
const appointmentProfessionalDetails = async (req, res) => {
    sequelize.query('CALL professionalBookingList(:token);', {
        replacements: {
            token: req.body.i_professionalToken
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `error data not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });
};



// professional history 
const appointmentProfDetails = async (req, res) => {
    sequelize.query('CALL profBookingList(:token);', {
        replacements: {
            token: req.body.i_professionalToken
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `error data not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });
};


const upcomingProfessionalBookings = async (req, res) => {
    sequelize.query('CALL upcomingProfessionalBookings(:token);', {
        replacements: {
            token: req.body.i_professionalToken
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `error data not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });
};

const professionalBookingListLast5 = async (req, res) => {
    sequelize.query('CALL professionalBookingListLast5(:token);', {
        replacements: {
            token: req.body.i_professionalToken
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `error data not found`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred."
            });
        });
};

module.exports = {
    getOneProfCategoryUnRegisterUser,
    getOneProfessionalUnRegisterUser,
    getallprofessional,
    userGetAllProfessional,
    getallprofessionalAdmin,
    getOneProfessional,
    getOneProfessionalAdmin,
    getOneProfCategory,
    updateProfessional,
    updateProfessionalinfo,
    createProfCategory,
    createProfessionalinfo,
    createProfessionalinfoAdmin,
    updateProfessionalinfoAdmin,
    updateProfessionalinfo,
    updateProfCategory,
    appointmentProfessionalDetails,
    appointmentProfDetails,
    professionalBookingListLast5,
    upcomingProfessionalBookings,
    getProfessional,
    updateProfessionalAdmin,

    getAllCategory,
    getAllProfCategoryCount,
    getAllCategoryDetail,
    getonebookingschedule,
    createProfQualify,
    updateProfQualify,
    createProfQualifyAdmin,
    updateProfQualifyAdmin,
    adminCancelProf,
    allProfessionalCount,
    register,
    login,

    //professional password
    forgotpassword,
    resetpassword,
    passwordreset,

    // getProfessionalsForCategorie
}
