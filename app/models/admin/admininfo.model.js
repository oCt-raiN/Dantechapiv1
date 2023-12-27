module.exports = (sequelize, Sequelize) => {
    const Admininfo = sequelize.define("admininfo", {
      adminId:{
        type:Sequelize.INTEGER,
        foreignKey:true,
      },
      age:{
        type: Sequelize.INTEGER
      },
      gender:{
        type: Sequelize.STRING
      },
      mobileNumber:{
        type: Sequelize.STRING
      },
      shortDescription: {
        type: Sequelize.STRING
      },
      activationDate: {
        type: Sequelize.DATE
      },
      address:{
        type: Sequelize.STRING
      },
      
    });
  
    return Admininfo;
  };
 