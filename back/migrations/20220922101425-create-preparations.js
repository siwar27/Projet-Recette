'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preparations', {
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
      duree: {
        allowNull: false,
        type: Sequelize.STRING
      },
      etape1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      etape2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      etape3: {
        allowNull: false,
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
    await queryInterface.dropTable('preparations');
  }
};