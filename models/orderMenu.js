'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')
const moment = require('moment')
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
  ackFromKitchenAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  sendToKitchenAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  finishedAt: {
    type: Sequelize.DATE,
    allowNull: true
  },
  cookTime: {
    type: Sequelize.VIRTUAL,
    get: function () {
      if (this.get('finishedAt') == null) {
        return null
      }
      var finishDate = moment(this.get('finishedAt'))
      var sendDate = moment(this.get('sendToKitchenAt'))
      return finishDate.diff(sendDate, 'seconds')
    }
  }
}, {
  freezeTableName: true,
  paranoid: true
})

module.exports = OrderMenu
