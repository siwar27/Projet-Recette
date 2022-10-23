'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('propositions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference:{
          models:"users",
          key:"id"
        }
      },
      proposition: {
        allowNull: false,
        type: Sequelize.STRING
      },
      choix: {
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
    await queryInterface.dropTable('propositions');
  }
};