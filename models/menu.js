'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')
const CategoryMenu = require('./categoryMenu.js')
const Order = require('./order')

const Menu = Conection.define('Menu', {
  MenuID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ShorDescription: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  DiscountPercentage: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  CategoryID: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'CategoryMenu',
      key: 'CategoryID'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  ElaborationTimeMin: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

Menu.belongsToMany(Order, {
  through: 'OrderMenu'
})

Menu.belongsTo(CategoryMenu, {
  foreignKey: 'CategoryID'
})

module.exports = Menu
