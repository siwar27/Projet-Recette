'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ingredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recetteeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'recettees',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      sucre: {
        type: Sequelize.STRING
      },
      viandes: {
        type: Sequelize.STRING
      },
      liquides: {
        type: Sequelize.STRING
      },
      legumes: {
        type: Sequelize.STRING
      },
      fruits: {
        type: Sequelize.STRING
      },
      epices: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ingredients');
  }
};