'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class preparations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.preparations.belongsTo(models.recettee, {
        foreignKey: 'recetteeId',
        as: 'recettee'
      });
    }
  }
  preparations.init({
    recetteeId: DataTypes.INTEGER,
    duree: DataTypes.STRING,
    etape1: DataTypes.STRING,
    etape2: DataTypes.STRING,
    etape3: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'preparations',
  });
  return preparations;
};