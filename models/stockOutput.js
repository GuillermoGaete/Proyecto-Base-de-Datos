'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const StockOutput = Conection.define('StockOutput', {
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
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)


module.exports = StockOutput
