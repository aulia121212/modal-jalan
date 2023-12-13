const config = require("../config/db.config.js");
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Koneksi  Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.socketPath
    ? {
        socketPath: dbConfig.socketPath,
      }
    : {},
});

const db = {};
// Menyimpan referensi Sequelize dan koneksi database
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Menghubungkan model User ke Sequelize
db.user = require("../models/user.model.js")(sequelize, Sequelize);

module.exports = db;
