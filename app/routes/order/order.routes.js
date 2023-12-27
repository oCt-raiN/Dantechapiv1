module.exports = app => {
    const order = require("../../controllers/order/order.controller")


    var router = require("express").Router();
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post("/createorder", order.createorders)
    // router.post("/createorder", (req, res) => {
    //     console.log(req.body);
    // });
    router.post("/getallorders", order.getallorders)

    app.use('/api/order', router);
};      