'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'StockOutput',
      {
        StockOutputID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Amount: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        StockInputID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'StockInput',
            key: 'StockInputID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
          allowNull: true
        },
        IngredientID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Ingredient',
            key: 'IngredientID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
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
    queryInterface.dropTable('StockOutput')
  }
}
