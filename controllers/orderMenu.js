const OrderMenu = require('../models/orderMenu')
const sequelize = require('sequelize')
const logger = require('../helpers/logger')

function ackOrder (order) {
  OrderMenu.findById(order).then(Order => {
    if (Order == null) {
      logger.log(logger.RED, 'CONTROLLER orderMenu', `Not found - Order:${order}`)
    } else {
      Order.update({
        ackFromKitchenAt: sequelize.fn('NOW'),
        sendToKitchenAt: Order.sendToKitchenAt,
        finishedAt: Order.finishedAt
      }).then((order) => {
        logger.log(logger.YELLOW, 'CONTROLLER orderMenu', `Order updated! Ack recived from Kitchen - Order:${order.OrderMenuID}`)
      })
      .catch((err) => {
        logger.log(logger.RED, 'CONTROLLER orderMenu', `Error while trying update Ack to order - Order:${order} - Error: ${err}`)
      })
    }
  })
}

function sentToKitchenOrder (order) {
  OrderMenu.findById(order).then(Order => {
    if (Order == null) {
      logger.log(logger.RED, 'CONTROLLER orderMenu', `Not found - Order:${order}`)
    } else {
      Order.update({
        ackFromKitchenAt: Order.ackFromKitchenAt,
        sendToKitchenAt: sequelize.fn('NOW'),
        finishedAt: Order.finishedAt
      }).then((order) => {
        logger.log(logger.YELLOW, 'CONTROLLER orderMenu', `Order updated! "sendToKitchenAt" - Order:${order.OrderMenuID}`)
      })
      .catch((err) => {
        logger.log(logger.RED, 'CONTROLLER orderMenu', `Error while trying update "sendToKitchenAt" to order - Order:${order} - Error: ${err}`)
      })
    }
  })
}

function readyOrder (order) {
  OrderMenu.findById(order).then(Order => {
    if (Order == null) {
      logger.log(logger.RED, 'CONTROLLER orderMenu', `Not found - Order:${order}`)
    } else {
      Order.update({
        finishedAt: sequelize.fn('NOW'),
        sendToKitchenAt: Order.sendToKitchenAt,
        ackFromKitchenAt: Order.ackFromKitchenAt
      }).then((orderUpdated) => {
        OrderMenu.findById(orderUpdated.OrderMenuID).then(orderSaved=>{
          logger.log(logger.YELLOW, 'CONTROLLER orderMenu', `Order updated! Finish recived from Kitchen - Order:${orderSaved.OrderMenuID} - cookTime:${orderSaved.cookTime}`)
        })
        })
      .catch((err) => {
        logger.log(logger.RED, 'CONTROLLER orderMenu', `Error while trying "finishedAt" to order - Order:${order} - Error: ${err}`)
      })
    }
  })
}

function finishedOrder (req, res) {
  OrderMenu.findAll({ where: { OrderID: req.body.Order, MenuID: req.body.Menu } }).then(Order => {
    if (Order[0] == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una Order con ID ${req.body.Order} que tenga un Menu con ID ${res.body.Menu}`
      })
    } else {
      Order[0].update({
        finishedAt: sequelize.fn('NOW')
      }).then(() => {
        res.status(200).send({
          found: true,
          updated: true
        })
        logger.log(logger.YELLOW, 'CONTROLLER orderMenu', `Order updated! finished Order from Kitchen - Order:${req.body.Order} - Menu:${req.body.Menu}`)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          found: true,
          updated: false,
          message: `Error interno al guardar el Order`
        })
      })
    }
  })
}

module.exports = {
  ackOrder,
  finishedOrder,
  readyOrder,
  sentToKitchenOrder
}
