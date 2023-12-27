module.exports = app => {
    const profilecntrl = require("../../controllers/profile/profile.controller")

    var router = require("express").Router();

    app.use('/api/profile', router);

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

      router.put("/save",profilecntrl.profilentry)
    
}

