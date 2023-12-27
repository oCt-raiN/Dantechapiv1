module.exports = (sequelize, Sequelize) => {
    const Doctors = sequelize.define("doctor", {
        clinicid: {
            type: Sequelize.STRING
        },
        doctorid: {
            type: Sequelize.STRING
        },
        Firstname: {
            type: Sequelize.STRING,
        },
        Lastname: {
            type: Sequelize.STRING,
        },
        Specialisation: {
            type: Sequelize.STRING,
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ["doctorid", "clinicid"]
            }
        ]
    }
    );
    return Doctors;
};