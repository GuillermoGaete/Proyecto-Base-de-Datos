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
          break;
      case "toStockManagerOut":
          logger.log(logger.GREEN, 'SERVICE routerPublishedChannels', `New message - Message: ${message} - Channel: ${channel}`)
      break;
      default:
          logger.log(logger.RED, 'SERVICE routerPublishedChannels', `Unprocesed message - Message: ${message} - Channel: ${channel}`)
      break;
  }
}
module.exports = {
  init
}
