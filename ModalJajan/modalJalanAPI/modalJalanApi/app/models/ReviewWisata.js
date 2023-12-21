// Table ReviewWisata
module.exports = (sequelize, DataTypes) => {
  const ReviewWisata = sequelize.define(
    "ReviewWisata",
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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      review: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      rating: {
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
      tableName: "ReviewWisata",
    }
  );

  // Relasi Table
  ReviewWisata.associate = (models) => {
    ReviewWisata.belongsTo(models.TempatWisata, {
      foreignKey: "tempatWisataId",
      as: "tempatWisata",
    });

    // Relasi dengan User
    ReviewWisata.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "Users",
    });
  };

  return ReviewWisata;
};
