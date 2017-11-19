'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const CategoryIngredient = Conection.define('CategoryIngredient', {
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
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = CategoryIngredient
