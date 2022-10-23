'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proposition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.proposition.belongsTo(models.user,{
        foreignKey: {
          name: 'userId'
        }
      });
    }
  }
  proposition.init({
    userId: DataTypes.INTEGER,
    proposition: DataTypes.STRING,
    choix: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'proposition',
  });
  return proposition;
};