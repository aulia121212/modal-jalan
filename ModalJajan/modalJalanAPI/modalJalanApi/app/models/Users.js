module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("Users", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true, // Validasi Email
      },
    },
    password: {
      type: Sequelize.STRING,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.ReviewWisata, {
      foreignKey: "userId",
      as: "reviews",
    });
  };

  return Users;
};
