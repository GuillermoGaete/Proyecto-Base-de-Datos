const Order = require('../models/order')
const Customer = require('../models/customer')
const config = require('./config.json')

function getOrder (req, res) {
  Order.findById(req.params.orderID, {
    include: [
      {
        model: Customer,
        attributes: ['CustomerID', 'Name', 'Surname', 'Email', 'MobilePhone', 'Gender']
      }
    ],
    attributes: ['OrderID', 'deliberedAt', 'createdAt', 'updatedAt']
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
  Order.findAll({limit: Number(limit)})
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
  const order = Order.build()
  order.save()
    .then(() => Order.findOrCreate({where: {OrderID: order.OrderID}}))
    .spread((user, created) => {
      res.status(200).send({
        created: true,
        message: 'Se cargo la orden correctamente',
        order: order
      })
    })
    .catch((err) => {
      console.error(`Error al guardar los valores: ${err}`)
      res.status(400).send({
        message: 'Se produjo un error inesperado'
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
  updateOrder,
  getOrder,
  getOrders,
  deleteOrder,
  createOrder
}
