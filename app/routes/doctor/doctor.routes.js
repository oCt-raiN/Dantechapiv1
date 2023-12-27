module.exports = app =>{
    const doctorcntrl= require("../../controllers/doctor/doctor.controller")

    var router = require("express").Router();


    app.use('/api/doctor', router);

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
      
    router.post("/save",doctorcntrl.adddoc)
    router.post("/getalldoctor",doctorcntrl.getalldoctordata)
}