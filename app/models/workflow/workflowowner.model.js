module.exports = (sequelize, Sequelize) => {
    const Workflowowner = sequelize.define("workflowowner", {
        workflowid: {
            type: Sequelize.STRING,
        },
        owner: {
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

    return Workflowowner;
};
