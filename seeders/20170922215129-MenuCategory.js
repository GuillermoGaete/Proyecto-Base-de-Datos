'use strict'

var faker = require('faker')
var falseDates = require('../helpers/falsedates')
faker.locale = "es"
const MenuList = require('../helpers/plain/MenuList')
const config = require('../config/seeding/config.json')
var CategoryList=[]

module.exports = {
  up: (queryInterface, Sequelize) => {
    MenuList.forEach(function(Menu, index, arr){
      var dateCategoryCreated = faker.date.between(config.createSingleBaseDateInit,config.createSingleBaseDateEnd)
      CategoryList.push({
        Name: Menu.category,
        deletedAt: null,
        createdAt: dateCategoryCreated,
        updatedAt: dateCategoryCreated
      })
    })

    return queryInterface.bulkInsert('CategoryMenu',CategoryList, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CategoryMenu', {}, {})
  }
};
