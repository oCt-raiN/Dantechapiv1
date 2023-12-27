module.exports = (sequelize, Sequelize) => {
    const orders = sequelize.define("orders", {
        orderid: {
            type: Sequelize.STRING,
        },
        clinicid: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
        },
        orderdate: {
            type: Sequelize.STRING,
        },
        orderassignment: {
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

    return orders;
};