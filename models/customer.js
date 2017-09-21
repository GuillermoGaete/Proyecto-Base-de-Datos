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
    allowNull: false
  },
  SoftDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
},
  {
    freezeTableName: true
  }
)

module.exports = Customer
