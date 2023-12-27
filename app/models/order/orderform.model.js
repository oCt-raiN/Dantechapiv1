module.exports = (sequelize, Sequelize) => {
    const Order_form = sequelize.define("orderform", {
        orderid: {
            type: Sequelize.STRING,
        },
        ordertoken: {
            type: Sequelize.STRING,
        },
        clinicid: {
            type: Sequelize.STRING,
        },
        doctorname: {
            type: Sequelize.STRING
        },
        doctorid: {
            type: Sequelize.STRING
        },
        patientname: {
            type: Sequelize.STRING
        },
        service: {
            type: Sequelize.STRING
        },
        type1: {
            type: Sequelize.STRING
        },
        option1: {
            type: Sequelize.STRING
        },
        type2: {
            type: Sequelize.STRING
        },
        option2: {
            type: Sequelize.STRING
        },
        type3: {
            type: Sequelize.STRING
        },
        option3: {
            type: Sequelize.STRING
        },
        type4: {
            type: Sequelize.STRING
        },
        option4: {
            type: Sequelize.STRING
        },
        type5: {
            type: Sequelize.STRING
        },
        option5: {
            type: Sequelize.STRING
        },
        type6: {
            type: Sequelize.STRING
        },
        option6: {
            type: Sequelize.STRING
        },
        type7: {
            type: Sequelize.STRING
        },
        option7: {
            type: Sequelize.STRING
        },
        type8: {
            type: Sequelize.STRING
        },
        option8: {
            type: Sequelize.STRING
        },
        type9: {
            type: Sequelize.STRING
        },
        option9: {
            type: Sequelize.STRING
        },
        type10: {
            type: Sequelize.STRING
        },
        option10: {
            type: Sequelize.STRING
        },
        type11: {
            type: Sequelize.STRING
        },
        option11: {
            type: Sequelize.STRING
        },
        type12: {
            type: Sequelize.STRING
        },
        option12: {
            type: Sequelize.STRING
        },
        type13: {
            type: Sequelize.STRING
        },
        option13: {
            type: Sequelize.STRING
        },
        type14: {
            type: Sequelize.STRING
        },
        option14: {
            type: Sequelize.STRING
        },
        type15: {
            type: Sequelize.STRING
        },
        option15: {
            type: Sequelize.STRING
        },
        type16: {
            type: Sequelize.STRING
        },
        option16: {
            type: Sequelize.STRING
        },
        type17: {
            type: Sequelize.STRING
        },
        option17: {
            type: Sequelize.STRING
        },
        type18: {
            type: Sequelize.STRING
        },
        option18: {
            type: Sequelize.STRING
        },
        type19: {
            type: Sequelize.STRING
        },
        option19: {
            type: Sequelize.STRING
        },
        type20: {
            type: Sequelize.STRING
        },
        option20: {
            type: Sequelize.STRING
        },
        file: {
            type: Sequelize.STRING
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

    return Order_form;
};
