module.exports = (sequelize, Sequelize) => {
  const SurveyInfo = sequelize.define("surveyInfo", {
    surveyinfoId: {
      type: Sequelize.STRING
    },
    organizationRollId: {
      type: Sequelize.STRING
    },
      organizationName: {
        type: Sequelize.STRING
      },
    userToken: {
      type: Sequelize.STRING,
      foreignKey: true,
    },
    date: {
      type: Sequelize.DATEONLY
    },
    question1: {
      type: Sequelize.STRING
    },
    answer1: {
      type: Sequelize.STRING
    },
    question2: {
      type: Sequelize.STRING
    },
    answer2: {
      type: Sequelize.STRING
    },
    question3: {
      type: Sequelize.STRING
    },
    answer3: {
      type: Sequelize.STRING
    },
    question4: {
      type: Sequelize.STRING
    },
    answer4: {
      type: Sequelize.STRING
    },
    question5: {
      type: Sequelize.STRING
    },
    answer5: {
      type: Sequelize.STRING
    },
    question6: {
      type: Sequelize.STRING
    },
    answer6: {
      type: Sequelize.STRING
    },
    question7: {
      type: Sequelize.STRING
    },
    answer7: {
      type: Sequelize.STRING
    },
    question8: {
      type: Sequelize.STRING
    },
    answer8: {
      type: Sequelize.STRING
    },
    question9: {
      type: Sequelize.STRING
    },
    answer9: {
      type: Sequelize.STRING
    },
    question10: {
      type: Sequelize.STRING
    },
    answer10: {
      type: Sequelize.STRING
    },
    question11: {
      type: Sequelize.STRING
    },
    answer11: {
      type: Sequelize.STRING
    },
    question12: {
      type: Sequelize.STRING
    },
    answer12: {
      type: Sequelize.STRING
    },
    question13: {
      type: Sequelize.STRING
    },
    answer13: {
      type: Sequelize.STRING
    },
    question14: {
      type: Sequelize.STRING
    },
    answer14: {
      type: Sequelize.STRING
    },
    question15: {
      type: Sequelize.STRING
    },
    answer15: {
      type: Sequelize.STRING
    },
    question16: {
      type: Sequelize.STRING
    },
    answer16: {
      type: Sequelize.STRING
    },
    question17: {
      type: Sequelize.STRING
    },
    answer17: {
      type: Sequelize.STRING
    },
    question18: {
      type: Sequelize.STRING
    },
    answer18: {
      type: Sequelize.STRING
    },
    question19: {
      type: Sequelize.STRING
    },
    answer19: {
      type: Sequelize.STRING
    },
    question20: {
      type: Sequelize.STRING
    },
    answer20: {
      type: Sequelize.STRING
    },
    question21: {
      type: Sequelize.STRING
    },
    answer21: {
      type: Sequelize.STRING
    },
    question22: {
      type: Sequelize.STRING
    },
    answer22: {
      type: Sequelize.STRING
    },
    question23: {
      type: Sequelize.STRING
    },
    answer23: {
      type: Sequelize.STRING
    },
    question24: {
      type: Sequelize.STRING
    },
    answer24: {
      type: Sequelize.STRING
    },
    question25: {
      type: Sequelize.STRING
    },
    answer25: {
      type: Sequelize.STRING
    },
    question26: {
      type: Sequelize.STRING
    },
    answer26: {
      type: Sequelize.STRING
    },
    question27: {
      type: Sequelize.STRING
    },
    answer27: {
      type: Sequelize.STRING
    },
    question28: {
      type: Sequelize.STRING
    },
    answer28: {
      type: Sequelize.STRING
    },
    answerComment: {
      type: Sequelize.STRING
    }

  });

  return SurveyInfo;
};
