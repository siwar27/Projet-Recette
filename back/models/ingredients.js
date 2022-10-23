'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ingredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ingredients.belongsTo(models.recettee, {
        foreignKey: 'recetteeId',
        as: 'recettee'
      });
    }
  }
  ingredients.init({
    recetteeId: DataTypes.INTEGER,
    sucre: DataTypes.STRING,
    viandes: DataTypes.STRING,
    liquides: DataTypes.STRING,
    legumes: DataTypes.STRING,
    fruits: DataTypes.STRING,
    epices: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ingredients',
  });
  return ingredients;
};