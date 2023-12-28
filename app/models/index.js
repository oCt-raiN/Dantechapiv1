const dbConfig = require("../config/db.config.js");

// const Association = require("./base");
// const BelongsTo = require("./belongs-to");
const Sequelize = require("sequelize");
const { Association } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.user = require("./user/user.model.js")(sequelize, Sequelize);
// db.userinfo = require("./user/userinfo.model.js")(sequelize, Sequelize);
db.admin = require("./admin/admin.model")(sequelize, Sequelize);
// db.admininfo = require("./admin/admininfo.model")(sequelize, Sequelize);
// db.organization = require("./organization/organization.model")(sequelize, Sequelize);
// db.surveyForm = require("./surveyForm/surveyForm.model.js")(sequelize, Sequelize);
// db.questions = require("./questions/questions.model.js")(sequelize, Sequelize);
// db.options = require("./options/options.model.js")(sequelize, Sequelize);
// db.surveyResult = require("./surveyResult/surveyResult.model.js")(sequelize, Sequelize);
// db.surveyResultDetails = require("./surveyResultDetails/surveyResultDetails.model.js")(sequelize, Sequelize);
// db.surveyInfo = require("./surveyInfo/surveyinfo.model.js")(sequelize, Sequelize);
// db.organizationRoll = require("./organizationRoll/organizationRoll.mode.js")(sequelize, Sequelize);
db.doctor = require("./doctors/doctors.model.js")(sequelize, Sequelize);
// db.status = require("./status/userstatus.model.js")(sequelize, Sequelize);
// db.statusdesc = require("./status/statusdesc.model.js")(sequelize, Sequelize);
db.order = require("./order/orderform.model.js")(sequelize, Sequelize);
db.profile = require("./profile/profiles.model.js")(sequelize, Sequelize);
db.bankdetail = require("./profile/profile_bank.model.js")(sequelize, Sequelize);
db.ordercategory = require("./order/ordercategory.model.js")(sequelize, Sequelize);
db.orders = require("./order/orders.model.js")(sequelize, Sequelize);
db.orderstatus = require("./order/orderstatus.model.js")(sequelize, Sequelize);
db.workflow = require("./workflow/workflow.model.js")(sequelize, Sequelize);
db.workflowassign = require("./workflow/workflowassignment.model.js")(sequelize, Sequelize);
db.workflowdetail = require("./workflow/workflowdetails.model.js")(sequelize, Sequelize);
db.workflowowner = require("./workflow/workflowowner.model.js")(sequelize, Sequelize);
db.assignee = require("./workflow/assigne.model.js")(sequelize, Sequelize);
db.jobs = require("./jobs/job.model.js")(sequelize, Sequelize);
db.jobstatus = require("./jobs/job.status.model.js")(sequelize, Sequelize);
db.jobassignment = require("./jobs/jobassignment.model.js")(sequelize, Sequelize);
db.jobdetail = require("./jobs/jobdetails.model.js")(sequelize, Sequelize);
db.jobnotification = require("./jobs/jobnotification.model.js")(sequelize, Sequelize);

db.statusdesc = require("./status/statusdesc.model.js")(sequelize, Sequelize);

db.user = require("./user/user.model.js")(sequelize, Sequelize);



// status and user link
db.user.belongsToMany(db.statusdesc, {
  through: "userstatusdesc",
  foreignKey: "userId",
  otherKey: "statusdescId",
  as: "statusdesc"
});

db.statusdesc.belongsToMany(db.user, {
  through: "userstatusdesc",
  foreignKey: "statusdescId",
  otherKey: "userId",
  as: "user"
});


//profile and user link
db.user.hasOne(db.profile, {
  foreignKey: "userId",
  as: "profileuser"
}
);
db.profile.belongsTo(db.user, {
  foreignKey: "userId"
});

//bankdetails and user link
db.user.hasOne(db.bankdetail, {
  foreignKey: "userId",
  as: "bankdetailuser"
}
);
db.bankdetail.belongsTo(db.user, {
  foreignKey: "userId"
});



module.exports = db;