module.exports = (sequelize, Sequelize) => {
    const SurveyResult = sequelize.define("surveyResult", {
      surveyResultId: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true, 
      },
      organizationId: {
        type: Sequelize.STRING,
        foreignKey:true
      },
      flatNumber: {
        type: Sequelize.STRING,
      },
      surveyPerson: {
        type: Sequelize.STRING,
      },
      userToken: {
        type: Sequelize.STRING,
      },
      surveyFormId: {
        type: Sequelize.STRING,
      },
      surveyDate: {
        type: Sequelize.DATEONLY,
      },
      SurveyTime: {
        type: Sequelize.TIME,
      },
    });
  
    return SurveyResult;
  };

  