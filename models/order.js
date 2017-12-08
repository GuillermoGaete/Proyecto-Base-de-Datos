'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')
const moment = require('moment')

const Order = Conection.define('Order', {
  OrderID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deliberedAt: {
    allowNull: true,
    type: Sequelize.DATE(3)
  },
  requiredAt: {
    allowNull: true,
    type: Sequelize.DATE(3)
  },
  completedAt: {
    allowNull: true,
    type: Sequelize.DATE(3)
  },
  CustomerID: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Customer',
      key: 'CustomerID'
    }
  },
  cookTime: {
    type: Sequelize.VIRTUAL,
    get: function () {
      var finishDate = moment(this.get('completedAt'))
      var sendDate = moment(this.get('createdAt'))
      if (finishDate == null) {
        return null
      }
      if (sendDate == null) {
        return null
      }
      return finishDate.diff(sendDate, 'seconds')
    }
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = Order
