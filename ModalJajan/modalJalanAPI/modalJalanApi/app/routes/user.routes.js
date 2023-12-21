const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

// Endpoint verifikasi
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/test/all", controller.publicAccess);

  app.get("/test/user", [authJwt.verifyToken], controller.userAccess);
};
