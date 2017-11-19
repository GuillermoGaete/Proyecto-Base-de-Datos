'use strict'

const MenuListPlain = require('../helpers/plain/MenuList')
const connection =  require('../connection')
var faker = require('faker')
faker.locale = "es"
const config = require('../config/seeding/config.json')
const CategoryMenu = require('../models/categoryMenu')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const CategoriesPromise = CategoryMenu.findAll()
    return Promise.all([CategoriesPromise]).then(values => {
      var MenusListGrouped=[]
      const Categories = values[0]
      for(var k in MenuListPlain){
        var auxCategoryID=0;
        Categories.forEach(function(Category){
          if(Category.Name==MenuListPlain[k].category){
            auxCategoryID=Category.CategoryID
          }
        })
        MenuListPlain[k]['categoryID']=auxCategoryID
        MenusListGrouped.push(MenuListPlain[k])
      }
      var MenuListComplete=[]
      MenusListGrouped.forEach(function(MenuListItem){
        var category = MenuListItem.categoryID;
        var menus= MenuListItem.menus;
        for(var k in menus){
          var dateMenuCreated = faker.date.between(config.createSingleBaseDateInit,config.createSingleBaseDateEnd)
          MenuListComplete.push({
            CategoryID: category,
            Name:menus[k].Name,
            Description:menus[k].Description,
            ShorDescription:menus[k].ShorDescription,
            Price:menus[k].Price,
            DiscountPercentage:menus[k].DiscountPercentage,
            ElaborationTimeMin:menus[k].ElaborationTimeMin,
            deletedAt: null,
            createdAt: dateMenuCreated,
            updatedAt: dateMenuCreated
          })
        }
      })
      return queryInterface.bulkInsert('Menu',MenuListComplete, {})

    })
    .catch(err=>{
      console.log('Error al ejecutar la busqueda:'+err)
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Menu', {}, {})
  }
}
