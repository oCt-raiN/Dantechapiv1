module.exports = (sequelize, Sequelize) => {
    const Workflowdetail = sequelize.define("workflowdetail", {
        workflowid: {
            type: Sequelize.STRING,
        },
        stepid: {
            type: Sequelize.STRING,
        },
        stepcode: {
            type: Sequelize.STRING,
        },
        description: {
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

    return Workflowdetail;
};