module.exports = (sequelize, Sequelize) => {
    const jobnotify = sequelize.define("jobnotify", {
        jobid: {
            type: Sequelize.STRING,
        },
        workflowid: {
            type: Sequelize.STRING,
        },
        stepid: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.STRING,
        },
        steps: {
            type: Sequelize.STRING,
        },
        steptype: {
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

    return jobnotify;
};