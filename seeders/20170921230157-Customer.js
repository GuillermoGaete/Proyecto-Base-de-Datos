'use strict'
const faker = require('faker')
const moment = require('moment')
faker.locale = "es"
const falseDates = require('../helpers/falsedates')
const config = require('../config/seeding/config.json')

var customers=[]
for(var i=1;i<=1000;i++){
  var dates=falseDates.getDates(config.createUserDateInit,moment().format('MM-DD-YYYY'),40,5)
  customers.push({
    Name: faker.name.firstName(),
    Surname: faker.name.lastName(),
    Gender:faker.random.boolean(),
    Email:faker.internet.email(),
    BirthdayDate:faker.date.between(config.userBirthdayDateInit,config.userBirthdayDateEnd),
    createdAt:dates.createdAtDate,
    updatedAt:dates.updatetAtDate,
    deletedAt:dates.deteltedAtDate
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Customer',customers, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Customer', {}, {})
  }
}
