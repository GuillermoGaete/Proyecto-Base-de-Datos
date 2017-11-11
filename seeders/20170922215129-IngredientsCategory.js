'use strict'

var faker = require('faker')
var falseDates = require('../helpers/falsedates')
faker.locale = "es"
const IngredientsList = require('../helpers/plain/IngredientList')
const config = require('../config/seeding/config.json')
var CategoryList=[]

module.exports = {
  up: (queryInterface, Sequelize) => {
    IngredientsList.forEach(function(Ingredient, index, arr){
      var dateCategoryCreated = faker.date.between(config.createSingleBaseDateInit,config.createSingleBaseDateEnd)
      CategoryList.push({
        Name: Ingredient.category,
        deletedAt: null,
        createdAt: dateCategoryCreated,
        updatedAt: dateCategoryCreated
      })
    })

    return queryInterface.bulkInsert('CategoryIngredient',CategoryList, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CategoryIngredient', {}, {})
  }
};
