module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define("profile", {
    image: {
      type: Sequelize.STRING,
      defaultValue: "assets/images/users/user.svg"
    },
    clinicid: {
      type: Sequelize.STRING
    },
    clinicName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    phonenumber: {
      type: Sequelize.STRING
    },
    alternativenumber: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    pincode: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
  },


    // {
    //     indexes : [
    //         {
    //             unique: true,
    //             fields: []
    //         }
    //     ]
    // }

  );
  return Profile;
};