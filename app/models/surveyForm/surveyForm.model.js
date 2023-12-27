module.exports = (sequelize, Sequelize) => {
  const SurveyForm = sequelize.define("surveyForm", {
    surveyFormId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    surveyName: {
      type: Sequelize.STRING
    },
    surveyDescription: {
      type: Sequelize.STRING
    },
    startDate: {
      type: Sequelize.DATEONLY
    },
    endDate: {
      type: Sequelize.DATEONLY
    },
    surveyStatus: {
      type: Sequelize.STRING,
      defaultValue: 'active'
    },
    activeInd: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });

  return SurveyForm;
};
