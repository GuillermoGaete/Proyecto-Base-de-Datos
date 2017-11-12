const Order = require('../models/order')
const Customer = require('../models/customer')
const Menu = require('../models/menu')
const config = require('./config.json')
const CustomerAttributes = ['CustomerID', 'Name', 'Surname', 'Email', 'MobilePhone', 'Gender']
const OrderAttributes = ['OrderID', 'deliberedAt', 'createdAt', 'updatedAt']
const MenuAttributes = ['MenuID', 'Name', 'Description', 'ShorDescription', 'Price', 'DiscountPercentage']

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
    CustomerID: config.env === 'development' ? 3 : req.body.CustomerID
  })
  order.save()
    .then(() => Order.findOrCreate({
      where: {OrderID: order.OrderID},
      include: [
        {
          model: Customer,
          attributes: CustomerAttributes
        }
      ],
      attributes: OrderAttributes
    }))
    .spread((orderCreated, created) => {
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
