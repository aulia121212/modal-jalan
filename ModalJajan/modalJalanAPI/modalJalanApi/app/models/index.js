const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = require("../config/db.config");
const db = {};

console.log(dbConfig);
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

// Menyimpan referensi Sequelize dan koneksi database
fs.readdirSync(path.join(__dirname, "../models"))
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, "../models", file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Fungsi asscostae relasi
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Menyimpan referensi Sequelize dan koneksi database
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
