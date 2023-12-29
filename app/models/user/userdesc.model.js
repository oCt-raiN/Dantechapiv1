module.exports = (sequelize, Sequelize) => {
    const Userdesc = sequelize.define("userdesc", {
        description: {
            type: Sequelize.STRING,
        }
    },
        // {
        //   indexes: [
        //     {
        //       unique: true,
        //       fields: ['userToken', 'email', 'clinicid'] // Replace with the actual column name being referenced
        //     }
        //   ]
        // }
    );

    return Userdesc;
};
