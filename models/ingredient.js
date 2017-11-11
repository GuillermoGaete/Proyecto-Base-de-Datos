'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const Ingredient = Conection.define('Ingredient', {
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
    }
  },
  MeasureUnitID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'MeasureUnit',
      key: 'MeasureUnitID'
    }
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
    allowNull: true,
    defaultValue: null
  }

},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = Ingredient
