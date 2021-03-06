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
    type: Sequelize.DATE(3),
    allowNull: true
  },
  sendToKitchenAt: {
    type: Sequelize.DATE(3),
    allowNull: true
  },
  finishedAt: {
    type: Sequelize.DATE(3),
    allowNull: true
  },
  cookTime: {
    type: Sequelize.VIRTUAL,
    get: function () {
      var finishDate = moment(this.get('finishedAt'))
      var sendDate = moment(this.get('ackFromKitchenAt'))
      if (finishDate == null) {
        return null
      }
      if (sendDate == null) {
        return null
      }
      return finishDate.diff(sendDate, 'seconds')
    }
  },
  inKitchenTime: {
    type: Sequelize.VIRTUAL,
    get: function () {
      var finishDate = moment(this.get('finishedAt'))
      var sendDate = moment(this.get('sendToKitchenAt'))
      if (finishDate == null) {
        return null
      }
      if (sendDate == null) {
        return null
      }
      return finishDate.diff(sendDate, 'seconds')
    }
  }
}, {
  freezeTableName: true,
  paranoid: true
})

module.exports = OrderMenu
