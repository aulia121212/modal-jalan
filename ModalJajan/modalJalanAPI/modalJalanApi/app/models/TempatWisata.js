// Table TempatWisata
module.exports = (sequelize, DataTypes) => {
  const TempatWisata = sequelize.define(
    "TempatWisata",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      alamat: {
        type: DataTypes.STRING,
      },
      deskripsi: {
        type: DataTypes.STRING,
      },
      level_pungli: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      tiket_masuk: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      tiket_parkir: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      makan: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "TempatWisata",
    }
  );
  // Relaasi TempatWisata
  TempatWisata.associate = (models) => {
    TempatWisata.hasMany(models.PungliWisata, {
      foreignKey: "tempatWisataId",
      as: "pungli",
    });
    TempatWisata.hasMany(models.GambarTempatWisata, {
      foreignKey: "tempatWisataId",
      as: "gambar",
    });
    TempatWisata.hasMany(models.ReviewWisata, {
      foreignKey: "tempatWisataId",
      as: "reviews",
    });
  };

  return TempatWisata;
};
