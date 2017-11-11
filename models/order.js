'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const Order = Conection.define('Order', {
  OrderID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deliberedAt: {
    allowNull: true,
    type: Sequelize.DATE
  },
  sendToKitchenAt: {
    allowNull: true,
    type: Sequelize.DATE
  },
  ackFromKitchenAt: {
    allowNull: true,
    type: Sequelize.DATE
  },
  CustomerID: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Customer',
      key: 'CustomerID'
    }
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = Order
