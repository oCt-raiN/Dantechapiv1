module.exports = (sequelize, Sequelize) => {
    const bankdetails = sequelize.define("bankdetails", {
        clinicid: {
            type: Sequelize.STRING
        },
        bankacnumber: {
            type: Sequelize.STRING
        },
        ifsc: {
            type: Sequelize.STRING
        },
        bankbranch: {
            type: Sequelize.STRING
        },
        upiid: {
            type: Sequelize.STRING
        },
        gst: {
            type: Sequelize.STRING
        }
    },
    );
    return bankdetails;
};