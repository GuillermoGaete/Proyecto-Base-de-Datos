const Order = require('../models/order')
const OrderMenu = require('../models/orderMenu')
const StockOutput = require('../models/stockOutput')
const Customer = require('../models/customer')
const Ingredient = require('../models/ingredient')
const Menu = require('../models/menu')
const config = require('./config.json')
const CustomerAttributes = ['CustomerID', 'Name', 'Surname', 'Email', 'MobilePhone', 'Gender']
const OrderAttributes = ['OrderID', 'deliberedAt', 'createdAt','completedAt','updatedAt', 'requiredAt','cookTime']
const MenuAttributes = ['MenuID', 'Name', 'Description', 'ElaborationTimeMin', 'ShorDescription', 'Price', 'DiscountPercentage']
const IngredientAttributes = ['Name']
const logger = require('../helpers/logger')
const redisClient = require('../service/redisClient')
const moment = require('moment')
const OrderMenuController = require('../controllers/orderMenu')
const MenssengerController = require('../controllers/messenger')
const sequelize = require('sequelize')

const dev=true;
const faker = require('faker')

function getLastOrder (req, res) {
  Order.findAll({
    limit:1,
    order:[['createdAt','DESC']],
    include: [
      {
        model: Menu,
        attributes: MenuAttributes,
        unique:false
      }
    ],
    attributes: OrderAttributes
  }).then(orders=>{
    if (orders[0] == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un el ultimo orden`
      })
    } else {
        res.status(200).send({
          found: true,
          Order:orders[0]
        })
    }
  })
}

function getOrder (req, res) {
  Order.findById(req.params.orderID, {
    include: [
      {
        model: Menu,
        attributes: MenuAttributes,
        unique:false
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
          Order:Order
        })
    }
  })
}

function checkCompleted(orderID){
  Order.findById(orderID).then(Order => {
    if (Order == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un Order con ID ${req.params.orderID}`
      })
    } else {
      Order.getMenus().then((menues)=>{
        var ready=1;
        menues.forEach(function(menu){
          if(menu.OrderMenu.cookTime){
            ready=ready*1;
          }else{
            ready=ready*0;
          }
        })
        if(ready){
          logger.log(logger.YELLOW, 'CONTROLLER order', `Order READY! - Order:${Order.OrderID}`)
          setCompleted(Order.OrderID)
        }else{
          logger.log(logger.YELLOW, 'CONTROLLER order', `Order not ready - Order:${Order.OrderID}`)
        }
      })
    }
  })
}

function setCompleted(OrderID){
  Order.findById(OrderID).then(Order => {
    if (Order == null) {
      logger.log(logger.RED, 'CONTROLLER order', `Order not found trying set completed - Order:${OrderID}`)
    } else {
      Order.update({
        completedAt: sequelize.fn('NOW')
      }).then((orderSaved) => {
        redisClient.pub.publishAsync("orderCompleted",orderSaved.OrderID).then((msg)=>{
          MenssengerController.msgToClient("ready",orderSaved.OrderID)
        })
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
  var menuesToInsert=[]
  Menu.findAll({
    order:[['MenuID','DESC']]
  }).then(menues=>{
    if (menues[0] != null && dev) {
      var toInsert = 1 + faker.random.number(8)
      for(var i = 0;i<=toInsert;i++){
        menuesToInsert.push(1 + faker.random.number(menues[0].MenuID-1))
      }
    } else {
      menuesToInsert=req.body.MenuesID
      }
    var order = Order.create({
      CustomerID: dev?(0 + (faker.random.number(999))):req.body.CustomerID
    }).then(order=>{
      order.setMenus(menuesToInsert).then((menues)=>{
        Order.findById(order.OrderID,{
          include: [
            {
              model: Customer,
              attributes: CustomerAttributes
            },
            {
              model: Menu,
              attributes: MenuAttributes
            }
          ],
          attributes: OrderAttributes
        }).then(orderCreated=>{
          var promiseInsertAll = []
          var list='menuesToKitchen'
          orderCreated.getMenus().then((menues)=>{
            menues.forEach(function(menu){
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
            Promise.all(promiseInsertAll).then((values) => {
              menues.forEach(function(menu){
                OrderMenuController.sentToKitchenOrder(menu.OrderMenu.OrderMenuID)
              })
              redisClient.pub.publishAsync("toKitchen", menues.length).then((msg)=>{
                return redisClient.printPub("toKitchen",menues.length)
              })

              res.status(200).send({
                created: true,
                saved: true,
                order: orderCreated
              })
                logger.log(logger.YELLOW, 'CONTROLLER order', `Order created! - Order:${order.OrderID}`)
                MenssengerController.msgToClient("created",order.OrderID)
                MenssengerController.msgToOwner("created",order.OrderID)
            })
          })

        }).catch(err=>{
          console.log(err)
        })
      })
    }).catch(err=>{
      console.log(err)
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
  checkCompleted,
  updateOrder,
  getOrder,
  getLastOrder,
  getOrders,
  deleteOrder,
  createOrder
}
