module.exports = app => {
    const wrkflwcntrl = require("../../controllers/workflow/workflow.controller")

    var router = require("express").Router();

    app.use('/api/workflow', router);

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post("/getallworkflow", wrkflwcntrl.getallworkflows)
    router.post("/getalldepartments", wrkflwcntrl.getalldepartments)

    // router.post("/createstatus",statuscntrl.createstatus)
}