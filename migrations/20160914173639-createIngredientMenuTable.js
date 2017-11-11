'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'IngredientMenu',
      {
        IngredientMenuID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        MenuID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Menu',
            key: 'MenuID'
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
        Amount: {
          type: Sequelize.INTEGER,
          allowNull: false
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
    queryInterface.dropTable('IngredientMenu')
  }
}
