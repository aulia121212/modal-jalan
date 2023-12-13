const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "modalJalan-session",
    keys: ["COOKIE_SECRET"], //secret key
    httpOnly: true,
    sameSite: "strict",
  })
);

// Databases
const db = require("./app/models");

db.sequelize.sync();

// Home or Welcome Message
app.get("/", (req, res) => {
  res.json({ message: "login-API" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
