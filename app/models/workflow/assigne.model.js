module.exports = (sequelize, Sequelize) => {
    const assignee = sequelize.define("assigne", {
        stepid: {
            type: Sequelize.STRING,
        },
        assignee: {
            type: Sequelize.STRING,
        },
        assignmentdept: {
            type: Sequelize.STRING,
        },
        assigneeid: {
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

    return assignee;
};
