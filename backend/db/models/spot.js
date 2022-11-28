'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' })
      // Spot.belongsToMany(models.User, {
      //   as: 'Reviews',
      //   through: models.Review,
      //   foreignKey: 'spotId',
      //   otherKey: 'userId',
      // });
      Spot.belongsToMany(models.User, {
        as: 'Bookings',
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId',
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
