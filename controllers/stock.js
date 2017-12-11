const StockOutput = require('../models/stockOutput')
const StockInput = require('../models/stockInput')
const Ingredient = require('../models/ingredient')
const MeasureUnit = require('../models/measureUnit')
const Menu = require('../models/menu')
const config = require('./config.json')
const MenuAttributes = ['MenuID', 'Name', 'Description', 'ElaborationTimeMin', 'ShorDescription', 'Price', 'DiscountPercentage']
const IngredientAttributes = ['Name','CriticalStock']
const MeasureUnitAttributes = ['Unit','UnitShort','UnitPlural','UnitPluralShort']
const StockOutputAttributes = ['Amount']
const logger = require('../helpers/logger')
const redisClient = require('../service/redisClient')
const moment = require('moment')
const sequelize = require('sequelize')
const dev=true;
const faker = require('faker')
const MenssengerController = require('../controllers/messenger')

function checkStockLevel(IngredientID){
  var stockOutputSumPromise = StockOutput.sum('Amount', {
    where: {
      IngredientID: IngredientID
    }
  })
  var stockInputSumPromise = StockInput.sum('Amount', {
    where: {
      IngredientID: IngredientID
    }
  })
  var IngredientPromise = Ingredient.findById(IngredientID,{
    attributes: IngredientAttributes,
    include:[{
      model:MeasureUnit,
      attributes:MeasureUnitAttributes
    }]
  })
  Promise.all([stockOutputSumPromise,stockInputSumPromise,IngredientPromise]).then((values)=>{
    var stockOutputSum=values[0]
    var stockInputSum=values[1]
    if(isNaN(stockInputSum)){
      stockInputSum=0
    }
    var Ingredient=values[2]
    var actualStock=stockInputSum-stockOutputSum
    var minimunToBuy=Ingredient.CriticalStock-actualStock
    if((stockInputSum-stockOutputSum)<=Ingredient.CriticalStock){
      MenssengerController.msgToOwner("needBuy",`Se necesita comprar ${minimunToBuy} ${minimunToBuy<=1?Ingredient.MeasureUnit.Unit:Ingredient.MeasureUnit.UnitPlural} de ${Ingredient.Name}`)
    }
  })
}

function registerOutput(MenuID){
Menu.findById(MenuID,{
  include: [
    {
      model: Ingredient,
      attributes: IngredientAttributes
    }
  ]
}).then(menuFinded=>{
  menuFinded.Ingredients.forEach(function(ingredient){
    StockOutput.create({
      IngredientID:ingredient.MenuIngredient.IngredientID,
      Amount:ingredient.MenuIngredient.Amount,
      StockInputID:null
    }).then((stockOutput)=>{
      StockOutput.findById(stockOutput.StockOutputID,{ include: [{ all: true ,nested: true}]}).then(stock=>{
        logger.log(logger.WHITE, 'CONTROLLER stock', `Stock OUTPUT register! - Ingredient:${stock.Ingredient.Name} - Amount:${stock.Amount}`)
        checkStockLevel(stock.Ingredient.IngredientID)
      })
      })
    })
}).catch(err=>{
  console.log(err)
})
}

module.exports = {
  registerOutput
}
