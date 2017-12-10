'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const MenuIngredient = Conection.define('MenuIngredient', {
  MenuIngredientID: {
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
  }
}, {
  freezeTableName: true,
  paranoid: true
})

module.exports = MenuIngredient
