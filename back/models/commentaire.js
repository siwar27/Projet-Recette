'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.belongsToMany(models.recettee, {
        through: models.commentaire,
        foreignKey: 'userId',
        otherkey: 'recetteeId'
      });
      models.recettee.belongsToMany(models.user, {
        through: models.commentaire,
        foreignKey: 'recetteeId',
        otherkey: 'userId'
      });
      models.commentaire.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user'
      });
      models.commentaire.belongsTo(models.recettee, {
        foreignKey: 'recetteeId',
        as: 'recettee'
      });
    }
  }
  commentaire.init({
    userId: DataTypes.INTEGER,
    recetteeId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'commentaire',
  });
  return commentaire;
};