const rp = require('request-promise')
const sequelize = require('sequelize')
const OrderMenu = require('../models/orderMenu')

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
            console.log(`Orden:${order.OrderID} - Menu: ${Menu.MenuID} - seended to kitchen correctly.`)
          })
          .catch((err) => {
            console.log(`Error al seteat el timestamp de envio a Arduino:${err}`)
          })
        })
        .catch((err) => {
          console.log('Error al buscar las odernes y menues insertados: ' + err.message)
        })
      })
      .catch(function (err) {
        console.log('Error al enviar la orden al sistema de preparacion: ' + err.message)
      })
    })
  })
  return collectedPromise
}

module.exports = {
  insertOrder
}
