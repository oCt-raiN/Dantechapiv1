module.exports = (sequelize, Sequelize) => {
    const jobstatus = sequelize.define("jobstatus", {
        jobstatus: {
            type: Sequelize.STRING,
        },
        details: {
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

    return jobstatus;
};