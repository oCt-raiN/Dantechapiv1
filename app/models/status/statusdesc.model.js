module.exports = (sequelize, Sequelize) => {
    const statusdesc = sequelize.define("statusdesc", {
        statuscode: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
    },
    );
    return statusdesc;
};