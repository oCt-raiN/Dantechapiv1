module.exports = app => {
    const statuscntrl = require("../../controllers/status/status.controller")

    var router = require("express").Router();

    app.use('/api/status', router);

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

      // router.post("/createstatus",statuscntrl.createstatus)
    }
