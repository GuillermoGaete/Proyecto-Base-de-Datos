'use strict'
const Sequelize = require('sequelize')
const Conection = require('../../connection')

const MeasureUnit = Conection.define('MeasureUnit', {
  MeasureUnitID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Unit: {
    type: Sequelize.STRING,
    allowNull: false
  },
  UnitShort: {
    type: Sequelize.STRING,
    allowNull: false
  },
  UnitPlural: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  UnitPluralShort: {
    type: Sequelize.STRING,
    defaultValue: null
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = MeasureUnit
