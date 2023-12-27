module.exports = (sequelize, Sequelize) => {
  const Organization = sequelize.define("organization", {
    organizationId: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    groupName: {
      type: Sequelize.STRING
    },
    details: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    activeInd: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['organizationId'] // Replace with the actual column name being referenced
      }
    ]
  });

  return Organization;
};
