module.exports = (sequelize, Sequelize) => {
    const Workflowassign = sequelize.define("workflowassign", {
        workflowid: {
            type: Sequelize.STRING,
        },
        stepid: {
            type: Sequelize.STRING,
        },
        assignmentdept: {
            type: Sequelize.STRING,
        },
        assignee: {
            type: Sequelize.STRING,
        }
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

    return Workflowassign;
};