'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

const Customer = Conection.define('Customer', {
  CustomerID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Surname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  MobilePhone: Sequelize.STRING,
  BirthdayDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  Gender: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    get () {
      return (this.getDataValue('Gender') ? 'Male' : 'Female')
    },
    set (val) {
      this.setDataValue('Gender', ((val === 'Male') ? 1 : 0))
    }
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = Customer
