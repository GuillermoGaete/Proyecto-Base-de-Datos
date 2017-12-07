const sequelize = require('sequelize')
const OrderMenuController = require('../controllers/orderMenu')
const OrderController = require('../controllers/order')
const MenuController = require('../controllers/menu')
const logger = require('../helpers/logger')
const redisClient = require('./redisClient')

function init(){
  redisClient.sub.subscribe("ackFromKitchen")
  redisClient.sub.subscribe("readyFromKitchen")
  redisClient.sub.subscribe("toStockManagerOut")
  redisClient.sub.on("message", function (channel, message) {
    redisClient.printSub(channel,message)
    processMessages(channel,message)
  })
  logger.log(logger.GREEN, 'SERVICE routerPublishedChannels', `Init service`)
  return true
}

function processMessages(channel,message){
  const jsonMessage = JSON.parse(message)
  switch (channel) {
      case "ackFromKitchen":
          OrderMenuController.ackOrder(jsonMessage.order)
          break;
      case "readyFromKitchen":
          OrderMenuController.readyOrder(jsonMessage.order)
          //TODO disparar un push en un canal que escuche un usuario
          break;
      case "toStockManagerOut":
          //TODO ejecutar un insert en la tabla de stock OUT
          //TODO Disparar un servicio que mire, los niveles de stock
          logger.log(logger.GREEN, 'SERVICE routerPublishedChannels', `New message - Channel: ${channel} - MenuID: ${message}`)
      break;
      case "toStockManagerIn":
          //TODO  ejecutar un insert en la tabla de stock IN
          logger.log(logger.GREEN, 'SERVICE routerPublishedChannels', `New message - Channel: ${channel} - MenuID: ${message}`)
      break;
      case "lowLevelStock":
          //TODO  informar de alguna forma ue hay poco stock al cliente, puede ser una push notification, o un registro en una tabla de alarmas
          logger.log(logger.GREEN, 'SERVICE routerPublishedChannels', `New message - Channel: ${channel} - Ingredient: ${message}`)
      break;
      default:
          logger.log(logger.RED, 'SERVICE routerPublishedChannels', `Unprocesed message - Message: ${message} - Channel: ${channel}`)
      break;
  }
}
module.exports = {
  init
}
