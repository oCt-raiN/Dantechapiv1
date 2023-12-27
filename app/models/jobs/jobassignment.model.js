module.exports = (sequelize, Sequelize) => {
    const jobassign = sequelize.define("jobassign", {
        assigndate: {
            type: Sequelize.STRING,
        },
        assignmentdept: {
            type: Sequelize.STRING,
        },
        indate: {
            type: Sequelize.STRING,
        },
        outdate: {
            type: Sequelize.STRING,
        },

    },
        // {
        //     indexes: [
        //       {
        //         unique: true,
        //         fields: ['orderid'] // Replace with the actual column name being referenced
        //       }
        //     ]
        //   }
    );

    return jobassign;
};