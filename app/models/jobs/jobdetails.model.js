module.exports = (sequelize, Sequelize) => {
    const jobdetail = sequelize.define("jobdetail", {
        stepid: {
            type: Sequelize.STRING,
        },
        duedate: {
            type: Sequelize.STRING,
        },
        actualdeliverdate: {
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

    return jobdetail;
};