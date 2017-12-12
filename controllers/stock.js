'use strict';

const StockOutput = require('../models/stockOutput');
const StockInput = require('../models/stockInput');
const Ingredient = require('../models/ingredient');
const MeasureUnit = require('../models/measureUnit');
const Menu = require('../models/menu');
const MenuIngredient = require('../models/menuIngredient');
const IngredientAttributes = ['Name', 'CriticalStock'];
const MeasureUnitAttributes = ['Unit', 'UnitShort', 'UnitPlural', 'UnitPluralShort'];
const logger = require('../helpers/logger');
const MenssengerController = require('../controllers/messenger');
const MenuIngredientAttributes = ['IngredientID', 'Amount']

function checkMenuesStock(menues){
    var MenuIngredientsPromises=[]
    menues.forEach(function(menu){
      var MenuIngredientsPromise = MenuIngredient.findAll({
        where:{
          MenuID:menu.MenuID
        },
        attributes:MenuIngredientAttributes,
        raw:true
      })
      MenuIngredientsPromises.push(MenuIngredientsPromise)
    })
    return Promise.all(MenuIngredientsPromises).then((values)=>{
      var Ingrediens=[]
      var amounts=[]
      values.forEach(function(MenuIngredientResult){
        MenuIngredientResult.forEach(function(ingredientsAmount){
          if(Ingrediens.indexOf(ingredientsAmount.IngredientID)<0){
            Ingrediens.push(ingredientsAmount.IngredientID)
            amounts[Ingrediens.indexOf(ingredientsAmount.IngredientID)]=ingredientsAmount.Amount
          }else{
            amounts[Ingrediens.indexOf(ingredientsAmount.IngredientID)]=amounts[Ingrediens.indexOf(ingredientsAmount.IngredientID)]+ingredientsAmount.Amount
          }
        })
      })
      var checkAvaliableStockLevelPromises=[]
      Ingrediens.forEach(function(ing,index){
        var checkAvaliableStockLevelPromise=checkAvaliableStockLevel(ing,amounts[index])
        checkAvaliableStockLevelPromises.push(checkAvaliableStockLevelPromise)
      })

      return Promise.all(checkAvaliableStockLevelPromises).then(values=>{
        var available=true
        values.forEach(function(value){
            available=value*available
        })
        return available
      })
    }).catch(reasons=>{
      console.log(reasons)
      return false
    })
}

function getStocksArraysForIngredient(IngredientID){
  var stockOutputSumPromise = StockOutput.sum('Amount', {
    where: {
      IngredientID: IngredientID,
      StockInputID: null
    }
  })
  var stockInputSumPromise = StockInput.sum('Amount', {
    where: {
      IngredientID: IngredientID,
      fullSpend: 0
    }
  })
  var IngredientPromise = Ingredient.findById(IngredientID,{
    attributes: IngredientAttributes,
    include:[{
      model:MeasureUnit,
      attributes:MeasureUnitAttributes
    }]
  })
  return [stockOutputSumPromise,stockInputSumPromise,IngredientPromise]
}

function checkAvaliableStockLevel(IngredientID,amount) {
  var ArrayStock = getStocksArraysForIngredient(IngredientID)
  return Promise.all(ArrayStock).then((values)=>{
    var stockOutputSum=values[0]
    var stockInputSum=values[1]
    if(isNaN(stockInputSum)){
      stockInputSum=0
    }
    var Ingredient=values[2]
    var newStock=stockInputSum-stockOutputSum-amount
    if(newStock<0){
      MenssengerController.msgToOwner("cantSold",`No se pudo concretar una venta porque no hay stock de ${Ingredient.Name}. Se necesitan: ${newStock*(-1)} ${Ingredient.MeasureUnit.UnitPlural} `)
      return false
    }else{
      MenssengerController.msgToOwner("infoStockChange",`El stock de ${Ingredient.Name} va a bajar de ${stockInputSum-stockOutputSum} a ${newStock}`)
      return true
    }
  })
}


function checkCriticalStockLevel(IngredientID) {
  var ArrayStock = getStocksArraysForIngredient(IngredientID)
  Promise.all(ArrayStock).then((values)=>{
    var stockOutputSum=values[0]
    var stockInputSum=values[1]
    if(isNaN(stockInputSum)){
      stockInputSum=0
    }
    var Ingredient=values[2]
    var actualStock=stockInputSum-stockOutputSum
    var minimunToBuy=Ingredient.CriticalStock-actualStock
    logger.log(logger.WHITE, 'CONTROLLER stock', `post Stock OUTPUT register! - Ingredient:${Ingredient.Name} - Amount:${stockInputSum-stockOutputSum}`)
    if((stockInputSum-stockOutputSum)<=Ingredient.CriticalStock){
        MenssengerController.msgToOwner("needBuy",`Se necesita comprar ${minimunToBuy} ${minimunToBuy<1?Ingredient.MeasureUnit.Unit:Ingredient.MeasureUnit.UnitPlural} de ${Ingredient.Name} para cubrir el stock minimo`)
    }
  })
}

function registerInput(res,req){
  var id=req.params.IngrediendID
  var amount=req.params.Amount
  Ingredient.findById(id).then(ingredient=>{
    StockInput.create({
      IngredientID:ingredient.IngredientID,
      Amount:amount,
      boughtAt:null
    }).then((stockInput)=>{
      StockOutput.findAll({
        where: {
          ingredientID: id,
          StockInputID:null
        },
        order: [
          ['createdAt', 'ASC']
        ]
      }).then(stocksOutput=>{

        if(stocksOutput!=null){
          //TODO ver como se resuelve el problema de insertar stock para que en el metodo que obtiene el array para calcular el stock disponible tome bien las cosas
          stocksOutput.forEach()
        }
      })
    })

}).catch(err=>{
  console.log(err)
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
        checkCriticalStockLevel(stock.Ingredient.IngredientID)
      })
      })
    })
}).catch(err=>{
  console.log(err)
})
}

module.exports = {
  registerOutput,
  checkMenuesStock,
  registerInput
}
