module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
      photo: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName:{
        type: Sequelize.STRING,
      },
      email:{
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      adminToken: {
        type: Sequelize.STRING
      },
      resetToken: {
        type: Sequelize.STRING
      },
      activeInd: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      }
     
    });

    return Admin;
  };
  
  