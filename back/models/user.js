'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.recettee,{ foreignKey: 'userId', onDelete: 'CASCADE' })
      models.user.hasMany(models.proposition,{ foreignKey: 'userId', onDelete: 'CASCADE' })
      models.user.hasMany(models.like);
      models.user.hasMany(models.commentaire);
    }
  }
  user.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};