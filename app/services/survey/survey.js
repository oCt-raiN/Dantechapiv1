    const db = require("../../models");
    const config = require("../../config/auth.config");
    const {sequelize,Sequelize } = require("../../models/index");
    const organization = db.organization;
    const surveyForm = db.surveyForm;
    const options =db.options;
    const questions = db.questions;
    const surveyResult = db.surveyResult;
    const surveyResultDetails = db.surveyResultDetails;
    const surveyInfo = db.surveyInfo
    const organizationRoll = db.organizationRoll;
    const User = db.user;
    const Admin=db.admin;
    const Admininfo=db.admininfo;
    var jwt = require("jsonwebtoken");
    var bcrypt = require("bcryptjs");
    const TokenGenerator = require('uuid-token-generator');
    const tokgen2 = new TokenGenerator(256,TokenGenerator.BASE62);

// create Organisation
const createOrganization = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    const newOrganization = await db.organization.create({
      organizationId: tokgen2.generate(),
      name: req.body.name,
      groupName: req.body.groupName,
      details: req.body.details,
      address: req.body.address,
      location: req.body.location,
      city: req.body.city,
      activeInd: req.body.activeInd
    }, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    const response = {
      message: "Organization created successfully.",
      organization: {
        activeInd: newOrganization.activeInd,
        organizationId: newOrganization.organizationId,
        name: newOrganization.name,
        groupName: newOrganization.groupName,
        details: newOrganization.details,
        address: newOrganization.address,
        location: newOrganization.location,
        city: newOrganization.city,
      }
    };

    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while creating the organization.",
    });
  }
};

// create survey
const createSurvey = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    const newSurveyForm = await db.surveyForm.create({
      surveyFormId: tokgen2.generate(),
      surveyName: req.body.surveyName,
      surveyDescription: req.body.surveyDescription,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      surveyStatus: req.body.surveyStatus,
      activeInd: req.body.activeInd
    }, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    const response = {
      message: "Survey created successfully.",
      surveyForm: {
        activeInd: newSurveyForm.activeInd,
        surveyFormId: newSurveyForm.surveyFormId,
        surveyName: newSurveyForm.surveyName,
        surveyDescription: newSurveyForm.surveyDescription,
        startDate: newSurveyForm.startDate,
        endDate: newSurveyForm.endDate,
        surveyStatus: newSurveyForm.surveyStatus,
      }
    };

    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while creating the survey.",
    });
  }
};

  // create questions
const createQuestions = async (req, res) => {
    try {
      const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      if (!admin) {
        return res.status(404).send({
          message: "Admin not found with token " + req.body.adminToken,
        });
      }
      const surveyForm = await db.surveyForm.findOne({ where: { surveyFormId: req.body.surveyFormId } });
  // If the surveyForm is not found return an error response 
  if (!surveyForm) {
    return res.status(404).send({
      message: "surveyForm not found with token " + req.body.surveyFormId
    });
  }
  
      const newQuestion = await db.questions.create({
        surveyFormId: surveyForm.surveyFormId,
        questionId: req.body.questionId,
        questionDetails: req.body.questionDetails,
        Mandatory: req.body.Mandatory,
        activeInd: req.body.activeInd
      }, {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
  
      res.send({
        message: "Question created successfully.",
        Question: newQuestion,
        adminToken: admin.adminToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Some error occurred while creating the survey.",
      });
    }
  };
  
  const createOptions = async (req, res) => {
    try {
      const admin = await Admin.findOne({
        where: { adminToken: req.body.adminToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      if (!admin) {
        return res.status(404).send({
          message: "Admin not found with token " + req.body.adminToken,
        });
      }
  
      const surveyForm = await db.surveyForm.findOne({ where: { surveyFormId: req.body.surveyFormId } });
      if (!surveyForm) {
        return res.status(404).send({
          message: "surveyForm not found with surveyId " + req.body.surveyFormId,
        });
      }
  
      const question = await db.questions.findOne({ where: { questionId: req.body.questionId } });
      if (!question) {
        return res.status(404).send({
          message: "Question not found with questionId " + req.body.questionId,
        });
      }
  
      let optionDetails;
      if (question.questionType === "text") {
        optionDetails = req.body.optionDetails;
      }
  
      const newOptions = await db.options.create(
        {
          surveyFormId: surveyForm.surveyFormId,
          questionId: question.questionId,
          optionId: req.body.optionId,
          optionDetails:req.body. optionDetails,
          activeInd: req.body.activeInd,
        },
        {
          fields: ['surveyId', 'questionId', 'optionId', 'optionDetails', 'activeInd'], // Exclude 'createdAt' and 'updatedAt'
        }
      );
  
      res.send({
        message: "Options created successfully.",
        options: newOptions,
        adminToken: admin.adminToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Some error occurred while creating the options.",
      });
    }
  };

  // create survey result
  const createSurveyResult = async (req, res) => {
    try {
      const surveyForm = await db.surveyForm.findOne({ where: { surveyFormId: req.body.surveyFormId } });
      if (!surveyForm) {
        return res.status(404).send({
          message: "surveyResult not found with surveyId " + req.body.surveyFormId,
        });
      }
  
      const organization = await db.organization.findOne({ where: { organizationId: req.body.organizationId } });
      if (!organization) {
        return res.status(404).send({
          message: "organization not found with organizationId " + req.body.organizationId,
        });
      }
  
      const user = await User.findOne({
        where: { userToken: req.body.userToken },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
      if (!user) {
        return res.status(404).send({
          message: "User info not found with userToken " + req.body.userToken,
        });
      }
  
      const newSurveyResult = await db.surveyResult.create({
        surveyResultId: tokgen2.generate(),
        surveyFormId: surveyForm.surveyFormId,
        organizationId: organization.organizationId,
        flatNumber: req.body.flatNumber,
        surveyPerson: req.body.surveyPerson,
        userToken: user.userToken,
        surveyDate: req.body.surveyDate,
        SurveyTime: req.body.SurveyTime,
      });
  
      const response = {
        message: "surveyResult created successfully.",
        surveyResult: {
          surveyResultId: newSurveyResult.surveyResultId,
          surveyFormId: newSurveyResult.surveyFormId,
          organizationId: newSurveyResult.organizationId,
          flatNumber: newSurveyResult.flatNumber,
          surveyPerson: newSurveyResult.surveyPerson,
          userToken: newSurveyResult.userToken,
          surveyDate: newSurveyResult.surveyDate,
          SurveyTime: newSurveyResult.SurveyTime,
        },
        
      };
  
      res.send(response);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Some error occurred while creating the options.",
      });
    }
  };
  
  const createSurveyResultDetails = async (req, res) => {
    try {
      const surveyResult = await db.surveyResult.findOne({ where: { surveyResultId: req.body.surveyResultId } });
      if (!surveyResult) {
        return res.status(404).send({
          message: "surveyResult not found with surveyResultId " + req.body.surveyResultId,
        });
      }
      const surveyForm = await db.surveyForm.findOne({ where: { surveyFormId: req.body.surveyFormId } });
      if (!surveyForm) {
        return res.status(404).send({
          message: "surveyResult not found with surveyId " + req.body.surveyFormId,
        });
      }
      const questions = await db.questions.findOne({ where: { questionId: req.body.questionId } });
      if (!questions) {
        return res.status(404).send({
          message: "Question not found with questionId " + req.body.questionId,
        });
      }
  
      // Validate that either answer or answerComments is not empty
if ((!req.body.answer || req.body.answer.trim() === '') && (!req.body.answerComments || req.body.answerComments.trim() === '')) {
  return res.status(400).send({
    message: "Either answer or answer comments are required.",
  });
}

  
      const newSurveyResultDetails = await db.surveyResultDetails.create({
        surveyResultDetailsId: tokgen2.generate(),
        surveyResultId: surveyResult.surveyResultId,
        surveyFormId: surveyForm.surveyFormId,
        questionId: questions.questionId,
        answer: req.body.answer,
        answerComments: req.body.answerComments,
        surveyDate: req.body.surveyDate,
        surveyTime: req.body.surveyTime,
      });
  
      const response = {
        message: "surveyResultDetails created successfully.",
        surveyResultDetails: {
          surveyResultDetailsId: newSurveyResultDetails.surveyResultDetailsId,
          surveyResultId: newSurveyResultDetails.surveyResultId,
          surveyFormId: newSurveyResultDetails.surveyFormId,
          questionId: newSurveyResultDetails.questionId,
          answer: newSurveyResultDetails.answer,
          answerComments: newSurveyResultDetails.answerComments,
          surveyDate: newSurveyResultDetails.surveyDate,
          surveyTime: newSurveyResultDetails.surveyTime,
        },
      };
  
      res.send(response);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Some error occurred while creating the options.",
      });
    }
  };
  
  //get all surveyruselt

const getAllSurveyResult = (req, res) => {
  db.surveyResult.findAll({
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
   
  })
    .then(data => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Error retrieving survey details." });
    });
};

//get all surveyform
const getAllSurvey = (req, res) => {
  db.surveyForm.findAll({
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
   
  })
    .then(data => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Error retrieving survey details." });
    });
};

//get all surveyform
const getAllOrganization = (req, res) => {
  db.organization.findAll({
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
   
  })
    .then(data => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Error retrieving survey details." });
    });
};

//get getAllSurveyResultDetails

const getAllSurveyResultDetails = (req, res) => {
  db.surveyResultDetails.findAll({
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
   
  })
    .then(data => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Error retrieving getAllSurveyResultDetails" });
    });
};

const getOneSurvey = (req, res) => {
  db.surveyForm.findOne({
    where: { surveyFormId: req.body.surveyFormId },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: db.questions,
        as: 'questions',
        attributes: ['questionId', 'questionDetails', 'surveyFormId', 'questionType', 'Mandatory', 'activeInd'],
        include: [
          {
            model: db.options,
            as: 'options',
            attributes: ['optionId', 'optionDetails', 'activeInd'],
          }
        ]
      }
    ]
  })
    .then(data => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: "Error retrieving survey details." });
    });
};

  
const getOneSurveyResult = async (req, res) => {
  try {
    const surveyResult = await db.surveyResult.findOne({
      where: { surveyResultId: req.body.surveyResultId },
      include: [
        {
          model: db.surveyForm,
          as: 'surveyForm',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.organization,
          as: 'organization',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!surveyResult) {
      return res.status(404).send({
        message: "Survey result not found with surveyResultId " + req.body.surveyResultId,
      });
    }

    const modifiedResponse = {
      surveyResultId: surveyResult.surveyResultId,
      organizationId: surveyResult.organizationId,
      flatNumber: surveyResult.flatNumber,
      surveyPerson: surveyResult.surveyPerson,
      userToken: surveyResult.userToken,
        surveyFormId: surveyResult.surveyForm.surveyFormId,
        surveyName: surveyResult.surveyForm.surveyName,
        surveyDescription: surveyResult.surveyForm.surveyDescription,
        startDate: surveyResult.surveyForm.startDate,
        endDate: surveyResult.surveyForm.endDate,
        surveyStatus: surveyResult.surveyForm.surveyStatus,
        activeInd: surveyResult.surveyForm.activeInd,
        organizationId: surveyResult.organization.organizationId,
        name: surveyResult.organization.name,
        groupName: surveyResult.organization.groupName,
        details: surveyResult.organization.details,
        address: surveyResult.organization.address,
        location: surveyResult.organization.location,
        city: surveyResult.organization.city,
        activeInd: surveyResult.organization.activeInd,
      
    };

    res.send(modifiedResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while retrieving the survey result.",
    });
  }
};


 
const getOneSurveyResultDetails = async (req, res) => {
  try {
    const surveyResultDetails = await db.surveyResultDetails.findOne({
      where: { surveyResultDetailsId: req.body.surveyResultDetailsId },
      include: [
        {
          model: db.surveyResult,
          as: 'surveyResult',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.surveyForm,
          as: 'surveyForm',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: db.questions,
          as: 'question',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: [
            {
              model: db.options,
              as: 'options',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
      ],
    });

    if (!surveyResultDetails) {
      return res.status(404).send({
        message: "Survey result details not found with surveyResultDetailsId " + req.params.surveyResultDetailsId,
      });
    }

    res.send({
      surveyResultDetailsId: surveyResultDetails.surveyResultDetailsId,
      surveyFormId: surveyResultDetails.surveyFormId,
      surveyDate: surveyResultDetails.surveyDate,
      surveyTime: surveyResultDetails.surveyTime,
      surveyResult: {
        organizationId: surveyResultDetails.surveyResult.organizationId,
        flatNumber: surveyResultDetails.surveyResult.flatNumber,
        surveyPerson: surveyResultDetails.surveyResult.surveyPerson,
        userToken: surveyResultDetails.surveyResult.userToken,
        surveyFormId: surveyResultDetails.surveyResult.surveyFormId,
        surveyDate: surveyResultDetails.surveyResult.surveyDate,
        SurveyTime: surveyResultDetails.surveyResult.SurveyTime,
      },
      surveyForm: {
        surveyFormId: surveyResultDetails.surveyForm.surveyFormId,
        surveyName: surveyResultDetails.surveyForm.surveyName,
        surveyDescription: surveyResultDetails.surveyForm.surveyDescription,
        startDate: surveyResultDetails.surveyForm.startDate,
        endDate: surveyResultDetails.surveyForm.endDate,
        surveyStatus: surveyResultDetails.surveyForm.surveyStatus,
        activeInd: surveyResultDetails.surveyForm.activeInd,
      },
      question: {
        surveyFormId: surveyResultDetails.question.surveyFormId,
        questionId: surveyResultDetails.question.questionId,
        questionDetails: surveyResultDetails.question.questionDetails,
        questionType: surveyResultDetails.question.questionType,
        Mandatory: surveyResultDetails.question.Mandatory,
        activeInd: surveyResultDetails.question.activeInd,
        options: surveyResultDetails.question.options.map(option => ({
          optionId: option.optionId,
          optionDetails: option.optionDetails,
          activeInd: option.activeInd,
        })),
      },
    });
    ;
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while retrieving the survey result details.",
    });
  }
};

// all count

const getAllCountSurveyResultDetails = async (req, res) => {
  try {
    const data = await db.surveyResultDetails.findAll({
      attributes: [
        "questionId",
        [sequelize.fn("count", sequelize.col("questionId")), "questionCount"],
        [sequelize.fn("count", sequelize.col("answer")), "answerCount"],
      ],
      group: ["questionId", "answer"],
      raw: true,
    });

    console.log(data);
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error retrieving getAllSurveyResultDetails" });
  }
};



const getAllSingleCountSurveyResultDetails = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    const whereClause = {};
    if (questionId) {
      whereClause.questionId = questionId;
    }
    if (answer) {
      whereClause.answer = answer;
    }

    const data = await db.surveyResultDetails.findAll({
      attributes: [
        "questionId",
        [sequelize.fn("count", sequelize.col("answer")), "answerCount"],
      ],
      where: whereClause,
      group: ["questionId"],
      raw: true,
    });

    console.log(data);
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error retrieving getAllSurveyResultDetails" });
  }
};

const getAllSingleCountSurveyinfosResultDetails = async (req, res) => {
  try {
    const { userToken, question, answer } = req.body;

    const whereClause = {
      userToken,
    };
    whereClause[question] = answer;

    const count = await db.surveyInfo.count({
      where: whereClause,
    });

    res.status(200).send({ count });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error retrieving surveyInfo data" });
  }
};

const createQuestionWithOptions = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    const surveyForm = await db.surveyForm.findOne({
      where: { surveyFormId: req.body.surveyFormId },
    });

    if (!surveyForm) {
      return res.status(404).send({
        message: "Survey form not found with ID " + req.body.surveyFormId,
      });
    }

    const { questionType, options } = req.body;

    const questionTypeCodes = {
      qt001: "ratingScale",
      qt002: "multipleSelectDropdown",
      qt003: "boolean",
      qt004: "typing",
      qt005: "checkbox",
    };

    if (!Object.keys(questionTypeCodes).includes(questionType)) {
      return res.status(400).send({
        message: "Invalid question type.",
      });
    }

    const newQuestion = await db.questions.create({
      surveyFormId: surveyForm.surveyFormId,
      questionId: req.body.questionId,
      questionDetails: req.body.questionDetails,
      questionType: questionTypeCodes[questionType],
      Mandatory: req.body.Mandatory,
      activeInd: req.body.activeInd,
    });

    if (questionType === "qt005" || questionType === "qt001" || questionType === "qt002") {
      if (!options || options.length === 0) {
        return res.status(400).send({
          message: "Options are required for this question type.",
        });
      }

      const newOptions = await db.options.bulkCreate(
        options.map((option) => ({
          surveyFormId: surveyForm.surveyFormId,
          questionId: newQuestion.questionId,
          optionId: Math.floor(Math.random() * 10000),
          optionDetails: option.optionDetails,
          activeInd: true,
        }))
      );

      const response = {
        message: "Question and options created successfully.",
        question: {
          surveyFormId: newQuestion.surveyFormId,
          questionId: newQuestion.questionId,
          questionDetails: newQuestion.questionDetails,
        
        },
        options: newOptions.map((option) => ({
        
          optionId: option.optionId,
          optionDetails: option.optionDetails,
        })),
        adminToken: admin.adminToken,
      };

      return res.status(200).send(response);
    } else if (questionType === "qt003" || questionType === "qt004") {
      const response = {
        message: "Question created successfully.",
        question: {
          surveyFormId: newQuestion.surveyFormId,
          questionId: newQuestion.questionId,
          questionDetails: newQuestion.questionDetails,
         
        },
        adminToken: admin.adminToken,
      };

      return res.status(200).send(response);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Some error occurred while creating the question and options.",
    });
  }
};

// const createSurveyinfo = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: { userToken: req.body.userToken },
//       attributes: { exclude: ['createdAt', 'updatedAt'] },
//     });
//     if (!user) {
//       return res.status(404).send({
//         message: "User info not found with userToken " + req.body.userToken,
//       });
//     }

//     const organizationRoll = await db.organizationRoll.create({
//       organizationRollId: tokgen2.generate(),
//       organizationName: req.body.organizationName,
//       customerName: req.body.customerName,
//       appartmentNumber: req.body.appartmentNumber,
//     });

//     const surveyInfo = await db.surveyInfo.create({
//       surveyinfoId: tokgen2.generate(),
//       organizationRollId: organizationRoll.organizationRollId,
//       userToken: user.userToken,
//       question1: req.body.question1,
//       answer1: req.body.answer1,
//       question2: req.body.question2,
//       answer2: req.body.answer2,
//       question3: req.body.question3,
//       answer3: req.body.answer3,
//       question4: req.body.question4,
//       answer4: req.body.answer4,
//       question5: req.body.question5,
//       answer5: req.body.answer5,
//       question6: req.body.question6,
//       answer6: req.body.answer6,
//       answerComment: req.body.answerComment,
//     });

//     const response = {
//       message: "Survey created successfully.",
//       organizationRoll: {
//         organizationRollId: organizationRoll.organizationRollId,
//         organizationName: organizationRoll.organizationName,
//         customerName: organizationRoll.customerName,
//         appartmentNumber: organizationRoll.appartmentNumber,
//         activeInd: organizationRoll.activeInd,
//       },
//       surveyInfo: {
//         surveyinfoId: surveyInfo.surveyinfoId,
//         userToken: surveyInfo.userToken,
//         question1: surveyInfo.question1,
//         answer1: surveyInfo.answer1,
//         question2: surveyInfo.question2,
//         answer2: surveyInfo.answer2,
//         question3: surveyInfo.question3,
//         answer3: surveyInfo.answer3,
//         question4: surveyInfo.question4,
//         answer4: surveyInfo.answer4,
//         question5: surveyInfo.question5,
//         answer5: surveyInfo.answer5,
//         question6: surveyInfo.question6,
//         answer6: surveyInfo.answer6,
//         answerComment: surveyInfo.answerComment,
//       }
//     };

//     res.send(response);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: "Some error occurred while creating the organization and survey info.",
//     });
//   }
// };


const createSurveyinfo = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userToken: req.body.userToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (!user) {
      return res.status(404).send({
        message: "User info not found with userToken " + req.body.userToken,
      });
    }

    const organizationRoll = await db.organizationRoll.create({
      organizationRollId: tokgen2.generate(),
      organizationName: req.body.organizationName,
      customerName: req.body.customerName,
      appartmentNumber: req.body.appartmentNumber,
    });

    const surveyData = req.body.surveyData; // Access the surveyData object

const surveyInfo = await db.surveyInfo.create({
  surveyinfoId: tokgen2.generate(),
  organizationRollId: organizationRoll.organizationRollId,
  organizationName:organizationRoll.organizationName,
  userToken: user.userToken,
  date:surveyData.date,
  question1: surveyData.question1,
  answer1: surveyData.answer1,
  question2: surveyData.question2,
  answer2: surveyData.answer2,
  question3: surveyData.question3,
  answer3: surveyData.answer3,
  question4: surveyData.question4,
  answer4: surveyData.answer4,
  question5: surveyData.question5,
  answer5: surveyData.answer5,
  question6: surveyData.question6,
  answer6: surveyData.answer6,
  question7: surveyData.question7,
  answer7: surveyData.answer7,
  question8: surveyData.question8,
  answer8: surveyData.answer8,
  question9: surveyData.question9,
  answer9: surveyData.answer9,
  question10: surveyData.question10,
  answer10: surveyData.answer10,
  question11: surveyData.question11,
  answer12: surveyData.answer12,
  question12: surveyData.question12,
  answer13: surveyData.answer13,
  question13: surveyData.question13,
  answer14: surveyData.answer14,
  question14: surveyData.question14,
  answer15: surveyData.answer15,
  question15: surveyData.question15,
  answer16: surveyData.answer16,
  question16: surveyData.question16,
  answer17: surveyData.answer17,
  question17: surveyData.question17,
  answer18: surveyData.answer18,
  question18: surveyData.question18,
  answer19: surveyData.answer19,
  question19: surveyData.question19,
  answer20: surveyData.answer20,
  question21: surveyData.question21,
  answer21: surveyData.answer21,
  question22: surveyData.question22,
  answer22: surveyData.answer22,
  question23: surveyData.question23,
  answer23: surveyData.answer23,
  question24: surveyData.question24,
  answer24: surveyData.answer24,
  question25: surveyData.question25,
  answer25: surveyData.answer25,
  question26: surveyData.question26,
  answer26: surveyData.answer26,
  question27: surveyData.question27,
  answer27: surveyData.answer27,
  question28: surveyData.question28,
  answer28: surveyData.answer28,

  answerComment: surveyData.answerComment,
});

const response = {
  message: "Survey created successfully.",
  organizationRoll: {
    organizationRollId: organizationRoll.organizationRollId,
    organizationName: organizationRoll.organizationName,
    customerName: organizationRoll.customerName,
    appartmentNumber: organizationRoll.appartmentNumber,
    activeInd: organizationRoll.activeInd,
  },
  surveyInfo: {
     date:surveyInfo.date,
    surveyinfoId: surveyInfo.surveyinfoId,
    userToken: surveyInfo.userToken,
    question1: surveyInfo.question1,
    answer1: surveyInfo.answer1,
    question2: surveyInfo.question2,
    answer2: surveyInfo.answer2,
    question3: surveyInfo.question3,
    answer3: surveyInfo.answer3,
    question4: surveyInfo.question4,
    answer4: surveyInfo.answer4,
    question5: surveyInfo.question5,
    answer5: surveyInfo.answer5,
    question6: surveyInfo.question6,
    answer6: surveyInfo.answer6,
    question7: surveyData.question7,
    answer7: surveyData.answer7,
    question8: surveyData.question8,
  answer8: surveyData.answer8,
  question9: surveyData.question9,
  answer9: surveyData.answer9,
  question10: surveyData.question10,
  answer10: surveyData.answer10,
  question11: surveyData.question11,
  answer12: surveyData.answer12,
  question12: surveyData.question12,
  answer13: surveyData.answer13,
  question13: surveyData.question13,
  answer14: surveyData.answer14,
  question14: surveyData.question14,
  answer15: surveyData.answer15,
  question15: surveyData.question15,
  answer16: surveyData.answer16,
  question16: surveyData.question16,
  answer17: surveyData.answer17,
  question17: surveyData.question17,
  answer18: surveyData.answer18,
  question18: surveyData.question18,
  answer19: surveyData.answer19,
  question19: surveyData.question19,
  answer20: surveyData.answer20,
  question21: surveyData.question21,
  answer21: surveyData.answer21,
  question22: surveyData.question22,
  answer22: surveyData.answer22,
  question23: surveyData.question23,
  answer23: surveyData.answer23,
  question24: surveyData.question24,
  answer24: surveyData.answer24,
  question25: surveyData.question25,
  answer25: surveyData.answer25,
  question26: surveyData.question26,
  answer26: surveyData.answer26,
  question27: surveyData.question27,
  answer27: surveyData.answer27,
  question28: surveyData.question28,
  answer28: surveyData.answer28,
    answerComment: surveyInfo.answerComment,
  }
};

res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while creating the organization and survey info.",
    });
  }
};

const getAllsurveyinfoCount = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    const surveyInfoCount = await db.surveyInfo.count();

    // Prepare the response object
    const response = {
      surveyInfoCount: surveyInfoCount, // Add the overall surveyInfo count to the response
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info count.",
    });
  }
};




const { Op } = require('sequelize');

const getOneDatesurveyinfoCount = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Check if the given date is provided in the request body
    if (req.body.date) {
      // If the date is provided, calculate the count for the provided date
      const surveyInfoCount = await db.surveyInfo.count({
        where: {
          date: {
            [Op.eq]: req.body.date,
          },
        },
      });

      // Prepare the response object with the count for the particular date
      const response = {
        surveyInfoCount: surveyInfoCount,
      };

      res.send(response);
    } else {
      // If the date is not provided, return an error response
      res.status(400).send({
        message: "Please provide a valid date in the request body to get the count for that date.",
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info count.",
    });
  }
};




const getOneCurrentsurveyinfoCount = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the count for the current date
    const surveyInfoCount = await db.surveyInfo.count({
      where: {
        date: {
          [Op.eq]: currentDate,
        },
      },
    });

    // Prepare the response object with the count for the current date
    const response = {
      surveyInfoCount: surveyInfoCount,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info count.",
    });
  }
};




const getOneWeeklysurveyinfoCount = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the start date of the current week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Calculate the end date of the current week (Saturday)
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Calculate the count for the current week
    const surveyInfoCount = await db.surveyInfo.count({
      where: {
        date: {
          [Op.gte]: startDate.toISOString().slice(0, 10),
          [Op.lte]: endDate.toISOString().slice(0, 10),
        },
      },
    });

    // Prepare the response object with the count for the current week
    const response = {
      weeklySurveyInfoCount: surveyInfoCount,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info count.",
    });
  }
};




const {  fn, col } = require('sequelize');

const getAllOrgWeeklysurveyinfoCount = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the start date of the current week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Calculate the end date of the current week (Saturday)
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Calculate the counts for each organization in the weekly range
    const weeklyCounts = await db.surveyInfo.findAll({
      attributes: ['organizationName', [fn('DATE', col('date')), 'date'], [fn('COUNT', '*'), 'count']],
      where: {
        date: {
          [Op.gte]: startDate.toISOString().slice(0, 10),
          [Op.lte]: endDate.toISOString().slice(0, 10),
        },
      },
      group: ['organizationName', 'date'],
    });

    // Prepare the response object with the counts for each organization
    const response = {
      weeklySurveyInfoCounts: weeklyCounts,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info counts.",
    });
  }
};


const getAllOrgCurrentDateSurveyInfoCount = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the start date of the current day
    const startDate = currentDate;

    // Calculate the end date of the current day
    const endDate = currentDate;

    // Calculate the counts for each organization on the current date
    const currentDayCounts = await db.surveyInfo.findAll({
      attributes: ['organizationName', [fn('COUNT', '*'), 'count']],
      where: {
        date: {
          [Op.eq]: currentDate,
        },
      },
      group: ['organizationName'],
    });

    // Prepare the response object with the counts for each organization
    const response = {
      currentDateSurveyInfoCounts: currentDayCounts,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info counts.",
    });
  }
};








const getWeeklyReportAnswer3Count = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the start date of the current week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Calculate the end date of the current week (Saturday)
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Calculate the counts for each answer value for each organization in the weekly range
    const weeklyCounts = await db.surveyInfo.findAll({
      attributes: ['organizationName', 'answer3', [fn('COUNT', col('answer3')), 'answer3Count']],
      where: {
        date: {
          [Op.gte]: startDate.toISOString().slice(0, 10),
          [Op.lte]: endDate.toISOString().slice(0, 10),
        },
      },
      group: ['organizationName', 'answer3'],
    });

    // Prepare the response object with the counts for each answer value for each organization
    const response = {
      weeklyReportAnswerCounts: weeklyCounts,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the weekly report answer counts.",
    });
  }
};


const getWeeklyReportAnswerCounts = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the start date of the current week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Calculate the end date of the current week (Saturday)
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Calculate the counts for each answer value in the weekly range
    const weeklyCounts = await db.surveyInfo.findAll({
      attributes: ['answer3', [fn('COUNT', col('answer3')), 'answer3Count']],
      where: {
        date: {
          [Op.gte]: startDate.toISOString().slice(0, 10),
          [Op.lte]: endDate.toISOString().slice(0, 10),
        },
      },
      group: ['answer3'],
    });

    // Prepare the response object with the counts for each answer value
    const response = {
      weeklyReportAnswerCounts: weeklyCounts,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the weekly report answer counts.",
    });
  }
};


const overallReportAnswerCounts = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Calculate the overall counts for each answer value
    const overallCounts = await db.surveyInfo.findAll({
      attributes: ['answer3', [fn('COUNT', col('answer3')), 'answer3Count']],
      group: ['answer3'],
    });

    // Prepare the response object with the overall counts for each answer value
    const response = {
      overallReportAnswerCounts: overallCounts,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the overall report answer counts.",
    });
  }
};
const getWeeklySurveyInfoCounts = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate the start date of the current week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Calculate the end date of the current week (Saturday)
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    // Create an array to store the survey counts for each day of the week
    const weeklyCounts = [];
    const currentDateCopy = new Date(startDate);
    while (currentDateCopy <= endDate) {
      const currentDateString = currentDateCopy.toISOString().slice(0, 10);
      const surveyInfoCount = await db.surveyInfo.count({
        where: {
          date: currentDateString,
        },
      });

      weeklyCounts.push({
        date: currentDateString,
        surveyInfoCount: surveyInfoCount,
      });

      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    // Prepare the response object with the weekly survey counts
    const response = {
      weeklySurveyInfoCounts: weeklyCounts,
    };

    res.send(response);

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the weekly survey info counts.",
    });
  }
};

const getOneDatesurveyinfoCountAndData = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { adminToken: req.body.adminToken },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found with token " + req.body.adminToken,
      });
    }

    // Check if both start date and end date are provided in the request body
    if (req.body.startDate && req.body.endDate) {
      // If both start date and end date are provided, filter the records within that date range
      const surveyInfoData = await db.surveyInfo.findAll({
        where: {
          date: {
            [Op.between]: [req.body.startDate, req.body.endDate],
          },
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      // Get the count of records within the date range
      const surveyInfoCount = await db.surveyInfo.count({
        where: {
          date: {
            [Op.between]: [req.body.startDate, req.body.endDate],
          },
        },
      });

      // Prepare the response object with the count and data for the date range
      const response = {
        surveyInfoCount: surveyInfoCount,
        surveyInfoData: surveyInfoData,
      };

      res.send(response);
    } else {
      // If either start date or end date is missing, return an error response
      res.status(400).send({
        message: "Please provide both start date and end date in the request body to get the count and data within that date range.",
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Some error occurred while getting the survey info count and data.",
    });
  }
};
  module.exports = {
    createOrganization,
    createSurvey,
    createQuestions,
    createOptions,
    createSurveyResult,
    createSurveyResultDetails,
    getAllSurvey,
    getAllSurveyResult,
    getAllOrganization,
    getAllSurveyResultDetails,
    getOneSurvey,
    getOneSurveyResult,
    getOneSurveyResultDetails,
    getAllCountSurveyResultDetails,
    getAllSingleCountSurveyResultDetails,
    createQuestionWithOptions,
    createSurveyinfo,
    getAllSingleCountSurveyinfosResultDetails,
    getAllsurveyinfoCount,
    getOneDatesurveyinfoCount,
    getOneCurrentsurveyinfoCount,
    getOneWeeklysurveyinfoCount,
    getAllOrgWeeklysurveyinfoCount,
    getAllOrgCurrentDateSurveyInfoCount,
    getWeeklyReportAnswer3Count,
    getWeeklyReportAnswerCounts,
    overallReportAnswerCounts,
    getWeeklySurveyInfoCounts,
    getOneDatesurveyinfoCountAndData


}  