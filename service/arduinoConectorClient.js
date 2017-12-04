const sequelize = require('sequelize')
const OrderMenuController = require('../controllers/orderMenu')
const OrderController = require('../controllers/order')
const MenuController = require('../controllers/menu')
const logger = require('../helpers/logger')
const redisClient = require('./redisClient')

function init(){
  redisClient.sub.subscribe("ackFromKitchen")
  redisClient.sub.subscribe("readyFromKitchen")
  redisClient.sub.on("message", function (channel, message) {
    redisClient.printSub(channel,message)
    processMessages(channel,message)
  })
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
      default:
          logger.log(logger.RED, 'SERVICE arduinoConectorClient', `Unprocesed message - Message: ${message} - Channel: ${channel}`)
      break;
  }
}

function insertOrder (order) {
  var MenuesPromise = order.getMenues()
  var collectedPromise = Promise.all([MenuesPromise]).then(values => {
    const Menues = values[0]
    Menues.forEach(function (Menu) {
      var options = {
        method: 'POST',
        uri: 'http://localhost:3001/insertOrder',
        body: {
          Menu: Menu,
          Order: order
        },
        json: true // Automatically stringifies the body to JSON
      }
      rp(options)
      .then(function (parsedBody) {
        OrderMenu.findAll({ where: { OrderID: order.OrderID, MenuID: Menu.MenuID } }).then((ordermenu) => {
          ordermenu[0].update({
            sendToKitchenAt: sequelize.fn('NOW')
          }).then((orderup) => {
            logger.log(logger.BLUE, 'SERVICE arduinoConectorClient', `Orden:${order.OrderID} - Menu: ${Menu.MenuID} - seended to kitchen correctly.`)
          })
          .catch((err) => {
            logger.log(logger.RED, 'SERVICE arduinoConectorClient', `Error al seteat el timestamp de envio a Arduino:${err}`)
          })
        })
        .catch((err) => {
          logger.log(logger.RED, 'SERVICE arduinoConectorClient', 'Error al buscar las odernes y menues insertados: ' + err.message)
        })
      })
      .catch(function (err) {
        logger.log(logger.RED, 'SERVICE arduinoConectorClient', 'Error al enviar la orden al sistema de preparacion: ' + err.message)
      })
    })
  })
  return collectedPromise
}



module.exports = {
  init
}
