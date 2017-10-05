'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')
const Customer = require('./customer')

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

Customer.hasMany(Order, {
  foreignKey: 'CustomerID'
})
Order.belongsTo(Customer, {
  foreignKey: 'CustomerID'
})
module.exports = Order
