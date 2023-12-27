module.exports = (sequelize, Sequelize) => {
    const ordercategory = sequelize.define("ordercategory", {
        orderid: {
            type: Sequelize.STRING,
        },
        workflowid: {
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

    return ordercategory;
};