'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'CategoryMenu',
      {
        CategoryID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        deletedAt: {
          type: Sequelize.DATE(3),
          allowNull: true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE(3),
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE(3),
          allowNull: false
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('CategoryMenu')
  }
}
