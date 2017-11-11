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
          allowNull: false,
        },
        OrderID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Order',
            key: 'OrderID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        StockInputID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'StockInput',
            key: 'StockInputID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
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
          type: Sequelize.DATE,
          allowNull:true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('StockOutput')
  }
}
