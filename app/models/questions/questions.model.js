module.exports = (sequelize, Sequelize) => {
  const Questions = sequelize.define("questions", {
    surveyFormId: {
      type: Sequelize.STRING,
     foreignKey:true,
    },
    questionId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    questionDetails: {
      type: Sequelize.STRING
    },
    questionType: {
      type: Sequelize.STRING
    },
    Mandatory: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    activeInd: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  
  });

  return Questions;
};
