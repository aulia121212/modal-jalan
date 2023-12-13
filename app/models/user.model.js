module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true, // Validasi apakah nilai yang dimasukkan adalah alamat email yang valid
      },
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
