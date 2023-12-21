const { verifySignUp } = require("../middleware");
const { signup, signin, signout } = require("../controllers/auth.controller");

//Endpoint User
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/signup", [verifySignUp.checkDuplicateUsernameOrEmail], signup);
  app.post("/signin", signin);
  app.post("/signout", signout);
};
