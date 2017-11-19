'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'StockInput',
      {
        StockInputID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Amount: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        boughtAt: {
          type: Sequelize.DATE(3),
          allowNull: false
        },
        IngredientID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Ingredient',
            key: 'IngredientID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
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
    queryInterface.dropTable('StockInput')
  }
}
