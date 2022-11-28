'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {foreignKey: 'userId', as: 'User' });
      Review.belongsTo(models.Spot, {foreignKey: 'spotId', as: 'Spot' });
      Review.hasMany(models.ReviewImage, {foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true })
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notEmpty: true,
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull:false,
      validate: {
        min: 1,
        max: 5,
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
