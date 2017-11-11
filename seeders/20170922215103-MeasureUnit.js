'use strict'

var faker = require('faker')
var falseDates = require('../helpers/falsedates')
faker.locale = "es"
const MeasureUnitPlain = require('../helpers/plain/MeasureUnitList')
const config = require('../config/seeding/config.json')
var MeasureUnitList=[]

module.exports = {
  up: (queryInterface, Sequelize) => {
    MeasureUnitPlain.forEach(function(MeasureUnit, index, arr){
      var dateUnitCreated = faker.date.between(config.createSingleBaseDateInit,config.createSingleBaseDateEnd)
      MeasureUnitList.push({
        Unit: MeasureUnit.unit,
        UnitShort: MeasureUnit.shortname,
        UnitPlural:MeasureUnit.longnamePlural,
        UnitPluralShort:MeasureUnit.shortnamePlural,
        deletedAt: null,
        createdAt: dateUnitCreated,
        updatedAt: dateUnitCreated
      })
    })

    return queryInterface.bulkInsert('MeasureUnit',MeasureUnitList, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('MeasureUnit', {}, {})
  }
};
