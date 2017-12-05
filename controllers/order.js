const Order = require('../models/order')
const OrderMenu = require('../models/orderMenu')
const Customer = require('../models/customer')
const Menu = require('../models/menu')
const config = require('./config.json')
const CustomerAttributes = ['CustomerID', 'Name', 'Surname', 'Email', 'MobilePhone', 'Gender']
const OrderAttributes = ['OrderID', 'deliberedAt', 'createdAt', 'updatedAt', 'requiredAt']
const MenuAttributes = ['MenuID', 'Name', 'Description', 'ElaborationTimeMin', 'ShorDescription', 'Price', 'DiscountPercentage']
// const ServiceArduino = require('../service/arduinoConectorClient')
const logger = require('../helpers/logger')
const redisClient = require('../service/redisClient')
const moment = require('moment')
const OrderMenuController = require('../controllers/orderMenu')


function getOrder (req, res) {
  Order.findById(req.params.orderID, {
    include: [
      {
        model: Menu,
        as: 'Menues',
        attributes: MenuAttributes
      }
    ],
    attributes: OrderAttributes
  }).then(Order => {
    if (Order == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un Order con ID ${req.params.orderID}`
      })
    } else {
      res.status(200).send({
        found: true,
        Order: Order
      })
    }
  })
}
function getOrders (req, res) {
  var limit = ((req.params.limit < config.maxLimitValue) ? req.params.limit : config.maxLimitValue)
  Order.findAll({
    limit: Number(limit),
    include: [
      {
        model: Customer,
        attributes: CustomerAttributes
      }
    ],
    attributes: OrderAttributes
  })
  .then((Orders) => {
    if (Orders.length !== 0) {
      res.status(200).send({
        found: true,
        Orders: Orders
      })
    } else {
      res.status(200).send({
        found: false
      })
    }
  })
  .catch((err) => {
    console.log(`Error al buscar las ordenes: ${err}`)
    res.status(500).send({
      message: 'Error al realizar la busqueda'
    })
  })
}

function createOrder (req, res) {
  var order = Order.create({
    CustomerID: req.body.CustomerID ? req.body.CustomerID : 3
  }).then(order=>{
    order.setMenues(req.body.MenuesID).then(()=>{
      Order.findById(order.OrderID,{
        include: [
          {
            model: Customer,
            attributes: CustomerAttributes
          },
          {
            model: Menu,
            as: 'Menues',
            attributes: MenuAttributes
          }
        ],
        attributes: OrderAttributes
      }).then(orderCreated=>{
        var promiseInsertAll = []
        var list='menuesToKitchen'
        orderCreated.Menues.forEach(function(menu){
          var menuToRedis={
            "menu": menu.MenuID,
            "order": menu.OrderMenu.OrderMenuID,
            "elaborationTime":menu.ElaborationTimeMin
          }
          var promisePublish = redisClient.Client.rpushAsync(list,JSON.stringify(menuToRedis)).then((insert)=>{
              return redisClient.printInsertion(list,insert,menuToRedis)
          })
          .catch((err) =>{
            return redisClient.printErrorInsertion(list,err,menuToRedis)
          })
          promiseInsertAll.push(promisePublish)
        })
        Promise.all(promiseInsertAll).then(values => {
          orderCreated.Menues.forEach(function(menu){
          OrderMenuController.sentToKitchenOrder(menu.OrderMenu.OrderMenuID)
          })
          redisClient.pub.publishAsync("toKitchen", orderCreated.Menues.length).then((msg)=>{
            return redisClient.printPub("toKitchen",orderCreated.Menues.length)
          })

          res.status(200).send({
            created: true,
            saved: true,
            order: orderCreated
          })
            logger.log(logger.YELLOW, 'CONTROLLER order', `Order created! - Order:${order.OrderID}`)
        })
      })
    })
  })
}

function updateOrder (req, res) {
  Order.findById(req.params.orderID).then(Order => {
    if (Order == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una ordern con ID ${req.params.orderID}`
      })
    } else {
      Order.update({
        deliberedAt: ((req.body.deliberedAt) ? req.body.deliberedAt : Order.deliberedAt),
        CustomerID: ((req.body.CustomerID) ? req.body.CustomerID : Order.CustomerID)
      }).then(() => {
        res.status(200).send({
          found: true,
          updated: true,
          Order: Order.dataValues
        })
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

function ackOrder (req, res) {
  OrderMenu.findAll({ where: { OrderID: req.body.Order, MenuID: req.body.MEnu } }).then(Order => {
    if (Order[0] == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una con ID ${req.body.Order}`
      })
    } else {
      Order[0].update({
        ackFromKitchenAt: ((req.body.deliberedAt) ? req.body.deliberedAt : Order.deliberedAt)
      }).then(() => {
        console.log("ack recibido")
        res.status(200).send({
          found: true,
          updated: true
        })
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

function deleteOrder (req, res) {
  Order.findById(req.params.orderID).then(Order => {
    if (Order == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una orden con ID ${req.params.orderID}`
      })
    } else {
      Order.destroy()
      .then(() => {
        res.status(200).send({
          found: true,
          destroyed: true
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          found: true,
          destroyed: false,
          message: `Error interno al eliminar la orden`
        })
      })
    }
  })
}

module.exports = {
  updateOrder,
  getOrder,
  getOrders,
  deleteOrder,
  createOrder,
  ackOrder
}
