module.exports = (sequelize, Sequelize) => {
    const jobs = sequelize.define("jobs", {
        workflowid: {
            type: Sequelize.STRING,
        },
        workflowType: {
            type: Sequelize.STRING,
        },
        jobid: {
            type: Sequelize.STRING,
        },
        createdate: {
            type: Sequelize.STRING,
        },
        coimpletiondate: {
            type: Sequelize.STRING,
        },
        jobstatus: {
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

    return jobs;
};