// Table PungliWisata

module.exports = (sequelize, DataTypes) => {
  const PungliWisata = sequelize.define(
    "PungliWisata",
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

      biaya: {
        allowNull: true,
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
      tablename: "PungliWisata",
    }
  );

  // relasi table
  PungliWisata.associate = (models) => {
    PungliWisata.belongsTo(models.TempatWisata, {
      foreignKey: "tempatWisataId",
      as: "tempatWisata",
    });
  };

  return PungliWisata;
};
