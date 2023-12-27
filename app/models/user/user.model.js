module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    clinicid: {
      type: Sequelize.STRING
    },
    clinicName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    phonenumber: {
      type: Sequelize.STRING
    },
    userToken: {
      type: Sequelize.STRING,
    },
    resetToken: {
      type: Sequelize.STRING
    },
    activeInd: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1
    },
    accessToken: {
      type: Sequelize.STRING
    }
  },
    // {
    //   indexes: [
    //     {
    //       unique: true,
    //       fields: ['userToken', 'email', 'clinicid'] // Replace with the actual column name being referenced
    //     }
    //   ]
    // }
  );

  return User;
};
