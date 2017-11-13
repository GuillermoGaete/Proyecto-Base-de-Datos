const OrderMenu = require('../models/orderMenu')
const sequelize = require('sequelize')

function ackOrder (req, res) {
  OrderMenu.findAll({ where: { OrderID: req.body.Order, MenuID: req.body.Menu } }).then(Order => {
    if (Order[0] == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una con ID ${req.body.Order}`
      })
    } else {
      Order[0].update({
        ackFromKitchenAt: sequelize.fn('NOW')
      }).then(() => {
        res.status(200).send({
          found: true,
          updated: true
        })
        console.log(`Order updated! Ack recived from Kitchen - Order:${req.body.Order} - Menu:${req.body.Menu}`)
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
  ackOrder
}
