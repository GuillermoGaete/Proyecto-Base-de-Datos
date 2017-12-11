'use strict'
const connection =  require('../connection')
var faker = require('faker')
faker.locale = "es"
const config = require('../config/seeding/config.json')
const Ingredient = require('../models/ingredient')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
var StockInputList=[]
  module.exports = {
    up: (queryInterface, Sequelize) => {
      const ingredientsPromise = Ingredient.findAll()
      return Promise.all([ingredientsPromise]).then(values => {
        var ingredients=values[0]
        ingredients.forEach(function(ingredient){
            var dateStockInput = faker.date.between("01-02-2004","01-02-2005")
            StockInputList.push({
              IngredientID:ingredient.IngredientID,
              Amount:ingredient.CriticalStock*2,
              deletedAt:null,
              createdAt:dateStockInput,
              updatedAt:dateStockInput,
              boughtAt:dateStockInput
            })
        })
        return queryInterface.bulkInsert('StockInput',StockInputList,{})
      })
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('StockInput', {}, {})
    }
  }
