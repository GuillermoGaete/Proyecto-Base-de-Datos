'use strict'
const connection =  require('../connection')
const MenuListPlain = require('../helpers/plain/MenuList')
var faker = require('faker')
faker.locale = "es"
const config = require('../config/seeding/config.json')
const CategoryMenu = require('../models/categoryMenu')
const Menu = require('../models/menu')
const Ingredient = require('../models/ingredient')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
var MenuIngredientList=[]
  module.exports = {
    up: (queryInterface, Sequelize) => {
      const menuesPromise = Menu.findAll()
      const ingredientsPromise = Ingredient.findAll()

      return Promise.all([menuesPromise,ingredientsPromise]).then(values => {
        var menues=values[0]
        var ingredients=values[1]
        menues.forEach(function(menuObject){
          MenuListPlain.forEach(function(menuesCategorized){
            var menus=menuesCategorized.menus
            menus.forEach(function(menu){
              if(menuObject.Name==menu.Name){
                var IngredientsIDs=[]
                var IngredientsAmount=[]
                menu.Ingredients.forEach(function(ing){
                  var nameIng=ing.Name
                  var amount=ing.amount
                  ingredients.forEach(function(ingredientObject){
                    if(ingredientObject.Name==nameIng){
                      IngredientsIDs.push(ingredientObject.IngredientID)
                      IngredientsAmount.push(amount)
                    }
                  })
                })
                IngredientsIDs.forEach(function(ingID,index){
                  var dateMenuCreated = faker.date.between("01-02-2003","01-02-2004")
                  MenuIngredientList.push({
                    MenuID: menuObject.MenuID,
                    IngredientID:ingID,
                    Amount:IngredientsAmount[index],
                    deletedAt:null,
                    createdAt:dateMenuCreated,
                    updatedAt:dateMenuCreated
                  })
                })
              }
            })
          })
        })

        return queryInterface.bulkInsert('MenuIngredient',MenuIngredientList,{})
      })
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('MenuIngredient', {}, {})
    }
  }
