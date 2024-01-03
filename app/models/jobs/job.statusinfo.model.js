module.exports = (sequelize, Sequelize) => {
    const jobstatusinfo = sequelize.define("jobstatusinfo", {
        jobStatusCode: {
            type: Sequelize.STRING,
        },
        jobStatusDescription: {
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

    return jobstatusinfo;
};