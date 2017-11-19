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
  const order = Order.build({
    CustomerID: req.body.CustomerID ? req.body.CustomerID : 3
  })
  order.save()
        .then(() => {
          Menu.findAll({ where: { MenuID: req.body.MenuesID } }).then(menus => {
            order.addMenues(menus).then((orderWithMenues) => {
              Order.findOrCreate({
                where: {OrderID: order.OrderID},
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
              }).spread((orderCreated, created) => {
                var promiseInsertAll = []
                var list='toKitchen'
                orderCreated.Menues.forEach(function (menu) {
                  var menuToRedis={
                    "menu": menu.MenuID,
                    "order": menu.OrderMenu.OrderMenuID
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
                    menu.OrderMenu.sendToKitchenAt=moment()
                  })
                  orderCreated.save().then((orderSaved)=>{
                    logger.log(logger.YELLOW, 'CONTROLLER order', `Order created! ID:${orderCreated.OrderID}`)
                    res.status(200).send({
                      created: true,
                      saved: true,
                      order: orderSaved
                    })
                  })
                  .catch(() =>{
                    logger.log(logger.RED, 'CONTROLLER order', `Order - Error saving`)
                    res.status(500).send({
                      created: false,
                      message: `Error internal code: 0x01`
                    })
                  })
                })
                .catch(reasons => {
                  orderCreated.destroy({ force: true }).then(() =>{
                    logger.log(logger.RED, 'CONTROLLER order', `Order destroyed - Error in redis RPUSH method`)
                    res.status(500).send({
                      created: false,
                      message: `Error internal code: 0x03`
                    })
                  })
                  .catch((err) =>{
                    logger.log(logger.RED, 'CONTROLLER order', `Order destroying - Error destroy sequelize command`)
                    res.status(500).send({
                      created: false,
                      message: `Error internal code: 0x02`
                    })
                  })
                })
              })
              .catch((err) => {
                console.error(`Error al guardar los valores: ${err}`)
                res.status(400).send({
                  message: 'Se produjo un error inesperado'
                })
              })
                /*
                ServiceArduino.insertOrder(order).then((response) => {
                Order.findOrCreate({
                  where: {OrderID: order.OrderID},
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
                }).spread((orderCreated, created) => {
                  res.status(200).send({
                    created: true,
                    message: 'Se cargo la orden correctamente',
                    order: orderCreated
                  })
                })
                .catch((err) => {
                  console.error(`Error al guardar los valores: ${err}`)
                  res.status(400).send({
                    message: 'Se produjo un error inesperado'
                  })
                })
              })
              .catch((err) => {
                console.error(`Error al utilizar insert en arduino: ${err}`)
              })
              */
            })
            .catch((err) => {
              logger.log(logger.RED, 'CONTROLLER order', `Error al agregar menues:${err})`)
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
