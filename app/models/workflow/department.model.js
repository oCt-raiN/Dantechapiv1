module.exports = (sequelize, Sequelize) => {
    const departments = sequelize.define("department", {
        department: {
            type: Sequelize.STRING,
        },
        deptcode: {
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

    return departments;
}
