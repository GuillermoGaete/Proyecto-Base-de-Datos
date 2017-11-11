'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const OrderMenu = Conection.define('OrderMenu', {
  OrderMenuID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  OrderID: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Order',
      key: 'OrderID'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
    allowNull: false
  },
  MenuID: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Menu',
      key: 'MenuID'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade',
    allowNull: false
  },
  Amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  paranoid: true
})

module.exports = OrderMenu
