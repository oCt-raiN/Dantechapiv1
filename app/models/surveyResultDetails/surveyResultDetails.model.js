module.exports = (sequelize, Sequelize) => {
    const SurveyResultDetails = sequelize.define("surveyResultDetails", {
      surveyResultDetailsId:{
        type:Sequelize.STRING,
      }, 
      surveyResultId:{
        type:Sequelize.STRING,
      },
      questionId: {
        type: Sequelize.INTEGER
      },
      answer:{
        type:Sequelize.STRING,        
      }, 
      answerComments:{
        type:Sequelize.STRING,        
      }, 
        surveyFormId:{
        type:Sequelize.STRING,
      },
      surveyDate: {
        type: Sequelize.DATEONLY,
      },
      surveyTime: {
        type: Sequelize.TIME,        
      }
      
    });
  
    return SurveyResultDetails;
  };
 