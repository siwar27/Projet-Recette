'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recettee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.recettee.belongsTo(models.user,{
        foreignKey: {
          name: 'userId'
        }
      });

      models.recettee.hasMany(models.like);
      models.recettee.hasMany(models.commentaire);
      models.recettee.hasMany(models.ingredients);
      models.recettee.hasMany(models.preparations);

    }
  }
  recettee.init({
    userId: DataTypes.INTEGER,
    titre: DataTypes.STRING,
    attachement: DataTypes.STRING,
    choix: DataTypes.STRING,
    likesCount: DataTypes.INTEGER,
    unlikesCount: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'recettee',
  });
  return recettee;
};