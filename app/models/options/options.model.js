module.exports = (sequelize, Sequelize) => {
    const Options = sequelize.define("options", {
      questionId:{
        type:Sequelize.INTEGER,
        foreignKey:true,
      }, 
      optionId:{
        type:Sequelize.STRING
      },
      optionDetails: {
        type: Sequelize.STRING
      },
      activeInd: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      }
      
    });
  
    return Options;
  };
 