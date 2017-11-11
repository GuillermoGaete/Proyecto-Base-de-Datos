'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const CategoryMenu = Conection.define('CategoryMenu', {
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

module.exports = CategoryMenu
