module.exports = (sequelize, Sequelize) => {
    const orderstatus = sequelize.define("orderstatus", {
        orderid: {
            type: Sequelize.STRING,
        },
        orderstatus: {
            type: Sequelize.STRING,
            // defaultValue: "WA4000",
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

    return orderstatus;
};