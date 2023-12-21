// Table GambarTempatWisata
module.exports = (sequelize, DataTypes) => {
  const GambarTempatWisata = sequelize.define(
    "GambarTempatWisata",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tempatWisataId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "TempatWisata",
          key: "id",
        },
      },
      nama_gambar: {
        allowNull: true,
        type: DataTypes.STRING,
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
      freezeTableName: true, //
    }
  );

  // relasi table
  GambarTempatWisata.associate = (models) => {
    GambarTempatWisata.belongsTo(models.TempatWisata, {
      foreignKey: "tempatWisataId",
      as: "tempatWisata",
    });
  };

  return GambarTempatWisata;
};
