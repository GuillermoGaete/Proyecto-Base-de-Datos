const config = require('./config.json')
const logger = require('../helpers/logger')
const Order = require('../models/order')
const Customer = require('../models/customer')
const Menu = require('../models/menu')
const CustomerAttributes = ['CustomerID', 'Name', 'Surname', 'Email', 'MobilePhone', 'Gender']
const MenuAttributes = ['MenuID', 'Name', 'Description', 'ElaborationTimeMin', 'ShorDescription', 'Price', 'DiscountPercentage']
const OrderAttributes = ['OrderID', 'deliberedAt', 'createdAt','completedAt','updatedAt', 'requiredAt','cookTime']
const redisClient = require('../service/redisClient')
const moment = require('moment')
const sequelize = require('sequelize')
const dev=false;
const faker = require('faker')
function msgToOwner(action,param){
  if(action=="needBuy"){
    redisClient.pub.publishAsync("buyMsgToOwner",param).then((msg)=>{
      if(dev){
        return redisClient.printPub("buyMsgToOwner",msg)
      }
    })
  }
  if(action=="infoStockChange"){
    redisClient.pub.publishAsync("infoStockChange",param).then((msg)=>{
      if(dev){
        return redisClient.printPub("infoStockChange",msg)
      }
    })
  }
  if(action=="cantSold"){
    redisClient.pub.publishAsync("cantSoldMsgToOwner",param).then((msg)=>{
      if(dev){
        return redisClient.printPub("cantSoldMsgToOwner",msg)
      }
    })
  }
  if(action=="created"){
    Order.findById(param, {
      include: [
        {
          model: Menu,
          attributes: MenuAttributes,
          unique:false
        },
        {
          model: Customer,
          attributes: CustomerAttributes
        }
      ],
      attributes: OrderAttributes
    }).then(Order => {
      var message=`Nuevo pedido #${Order.OrderID} para ${Order.Customer.Name} ${Order.Customer.Surname}`
      redisClient.pub.publishAsync("createdMsgToOwner",message).then((msg)=>{
        if(dev){
          return redisClient.printPub("createdMsgToOwner",msg)
        }
      })
    })
  }
}

function msgToClient(action,order){
  Order.findById(order, {
    include: [
      {
        model: Menu,
        attributes: MenuAttributes,
        unique:false
      },
      {
        model: Customer,
        attributes: CustomerAttributes
      }
    ],
    attributes: OrderAttributes
  }).then(Order => {
    if (Order == null) {
      logger.log(logger.RED, 'CONTROLLER messeger', `Order not found trying set completed - Order:${OrderID}`)
    } else {
      if(action=="ready"){
        var message=`${Order.Customer.Name} ${Order.Customer.Surname} tu pedido #${Order.OrderID} esta listo para que puedas retirarlo`
        redisClient.pub.publishAsync("readyMsgToClient",message).then((msg)=>{
          return redisClient.printPub("readyMsgToClient",msg)
        })
      }
      if(action=="created"){
        var message=`${Order.Customer.Name} ${Order.Customer.Surname} tu pedido #${Order.OrderID} ya esta en nuestra cocina`
        redisClient.pub.publishAsync("createdMsgToClient",message).then((msg)=>{
          return redisClient.printPub("createdMsgToClient",msg)
        })
      }
    }
  }).catch(err=>{
    logger.log(logger.RED, 'CONTROLLER messeger', `Error:${err}`)
  })
}

module.exports = {
  msgToClient,
  msgToOwner
}
