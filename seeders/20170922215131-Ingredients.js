'use strict'

const IngredientsListPlain = require('../helpers/plain/IngredientList')
const connection =  require('../connection')
var faker = require('faker')
faker.locale = "es"
const config = require('../config/seeding/config.json')
const CategoryIngredient = require('../models/categoryIngredient')
const MeasureUnit = require('../models/measureUnit')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const CategoriesPromise = CategoryIngredient.findAll()
    const MeasureUnitsPromise = MeasureUnit.findAll()
    return Promise.all([CategoriesPromise, MeasureUnitsPromise]).then(values => {
      var IngredientsListGrouped=[]
      const Categories = values[0]
      const MeasureUnits = values[1]
      for(var k in IngredientsListPlain){
        var auxCategoryID=0;
        Categories.forEach(function(Category){
          if(Category.Name==IngredientsListPlain[k].category){
            auxCategoryID=Category.CategoryID
          }
        })
        IngredientsListPlain[k]['categoryID']=auxCategoryID
        IngredientsListGrouped.push(IngredientsListPlain[k])
      }
      var IngredientListComplete=[]
      IngredientsListGrouped.forEach(function(IngredientListItem){
        var category = IngredientListItem.categoryID;
        var ingredients= IngredientListItem.ingredients;
        for(var k in ingredients){
          var MeasureUnitID=0;
          MeasureUnits.forEach(function(MeasueUnit){
            if(MeasueUnit.Unit==ingredients[k].unit){
              MeasureUnitID=MeasueUnit.MeasureUnitID
            }
          })
          var dateIngredientCreated = faker.date.between(config.createSingleBaseDateInit,config.createSingleBaseDateEnd)
          IngredientListComplete.push({
            CategoryID: category,
            MeasureUnitID: MeasureUnitID,
            Name:ingredients[k].name,
            CriticalStock: ingredients[k].criticalStock,
            deletedAt: null,
            createdAt: dateIngredientCreated,
            updatedAt: dateIngredientCreated
          })
        }
      })
      return queryInterface.bulkInsert('Ingredient',IngredientListComplete, {})

    })
    .catch(err=>{
      console.log('Error al ejecutar la busqueda:'+err)
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ingredient', {}, {})
  }
}
