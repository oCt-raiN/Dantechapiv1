module.exports = (sequelize, Sequelize) => {
    const assignee = sequelize.define("assigne", {
        assignee: {
            type: Sequelize.STRING,
        },
        departmentid: {
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
