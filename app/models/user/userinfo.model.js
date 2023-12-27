module.exports = (sequelize, Sequelize) => {
    const Userinfo = sequelize.define("Userinfo", {
      userId:{
      type:Sequelize.INTEGER,
      foreignKey:true,
      },
      mobileNumber: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      activeInd: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      }
   
    });
    return Userinfo;
  };