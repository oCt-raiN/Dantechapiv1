module.exports = (sequelize, Sequelize) => {
    const OrganizationRoll = sequelize.define("organizationRoll", {
      organizationRollId: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      organizationName: {
        type: Sequelize.STRING
      },
      customerName: {
        type: Sequelize.STRING
      },
      appartmentNumber: {
        type: Sequelize.STRING
      },
      activeInd: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      }
    })
    
  
    return OrganizationRoll;
  };
//   const sequelize = new Sequelize(/* Your Sequelize configuration here */);

// // Define the stored procedure function using Sequelize
// const getAllOrgWeeklysurveyinfoCount = async (adminToken) => {
//   try {
//     // Call the stored procedure using Sequelize
//     const result = await sequelize.query(
//       'CALL getAllOrgWeeklysurveyinfoCount(:adminToken)',
//       {
//         replacements: { adminToken: adminToken },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     return result;
//   } catch (error) {
//     console.error('Error executing stored procedure:', error);
//     throw error;
//   }
// };

// // Call the stored procedure with the adminToken value
// const adminToken = 'M2hiEi5wLjBDKwxjrPaPpXYbFNpBMT1T3xK9Mb9hPlQ';
// const result = await getAllOrgWeeklysurveyinfoCount(adminToken);
// console.log(result);
