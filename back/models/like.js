'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.belongsToMany(models.recettee, {
        through: models.like,
        foreignKey: 'userId',
        otherkey: 'recetteeId'
      });
      models.recettee.belongsToMany(models.user, {
        through: models.like,
        foreignKey: 'recetteeId',
        otherkey: 'userId'
      });
      models.like.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user'
      });
      models.like.belongsTo(models.recettee, {
        foreignKey: 'recetteeId',
        as: 'recettee'
      });
    }
  }
  like.init({
    userId: DataTypes.INTEGER,
    recetteeId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'like',
  });
  return like;
};