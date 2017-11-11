'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'Ingredient',
      {
        IngredientID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        CategoryID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'CategoryIngredient',
            key: 'CategoryID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        MeasureUnitID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'MeasureUnit',
            key: 'MeasureUnitID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        Name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        CriticalStock: {
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
    queryInterface.dropTable('Ingredient')
  }
}
