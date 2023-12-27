module.exports = app => {
    const organization = require("../../controllers/organization/organization.controller");
    
  
    var router = require("express").Router();
        app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    

      
      //  createorganization
      router.post("/createOrganization",organization.createOrganization);
      router.get("/getAllOrganization",organization.getAllOrganization);
      


      app.use('/api/organization', router);    
};    