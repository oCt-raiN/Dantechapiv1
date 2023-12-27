module.exports = (sequelize, Sequelize) => {
    const Workflow = sequelize.define("workflow", {
        workflowid: {
            type: Sequelize.STRING,
        },
        workflowType: {
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

    return Workflow;
};