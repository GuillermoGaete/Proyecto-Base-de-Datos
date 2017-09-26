'use strict'
const Sequelize = require('sequelize')
const Conection = require('../../connection')

const CategoryMenu = Conection.define('CategoryMenu', {
  CategoryID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = CategoryMenu
