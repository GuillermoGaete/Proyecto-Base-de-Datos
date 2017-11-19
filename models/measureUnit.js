'use strict'
const Sequelize = require('sequelize')
const Conection = require('../connection')

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
  },
  deletedAt: {
    type: Sequelize.DATE(3),
    allowNull: true,
    defaultValue: null
  }
},
  {
    freezeTableName: true,
    paranoid: true
  }
)

module.exports = MeasureUnit
