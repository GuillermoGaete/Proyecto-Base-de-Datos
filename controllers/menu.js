const Menu = require('../models/menu')
const Customer = require('../models/customer')
const Order = require('../models/order')
const config = require('./config.json')
const OrderAttributes = ['OrderID', 'CustomerID']
const MenuAttributes = ['MenuID', 'Name', 'Description', 'ShorDescription', 'Price', 'DiscountPercentage']
const CustomerAttributes = ['CustomerID', 'Name', 'Email']

function getMenu (req, res) {
  Menu.findById(req.params.menuID, {
    include: [
      {
        model: Order,
        as: 'inOrders',
        attributes: OrderAttributes
      }
    ],
    attributes: MenuAttributes
  }).then(Menu => {
    if (Menu == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un Menu con ID ${req.params.menuID}`
      })
    } else {
      res.status(200).send({
        found: true,
        Menu: Menu
      })
    }
  })
}
function getMenus (req, res) {
  var limit = ((req.params.limit < config.maxLimitValue) ? req.params.limit : config.maxLimitValue)
  Menu.findAll({
    limit: Number(limit),
    attributes: MenuAttributes,
    include: [
      {
        model: Order,
        as: 'inOrders',
        attributes: OrderAttributes
      }
    ]
  })
  .then((Menus) => {
    if (Menus.length !== 0) {
      res.status(200).send({
        found: true,
        Menus: Menus
      })
    } else {
      res.status(200).send({
        found: false
      })
    }
  })
  .catch((err) => {
    console.log(`Error al buscar los menus: ${err}`)
    res.status(500).send({
      message: 'Error al realizar la busqueda'
    })
  })
}

function createMenu (req, res) {
  const order = Menu.build({
    CustomerID: config.env === 'development' ? 3 : req.body.CustomerID
  })
  order.save()
    .then(() => Menu.findOrCreate({
      where: {MenuID: order.MenuID},
      include: [
        {
          model: Customer,
          attributes: CustomerAttributes
        }
      ],
      attributes: MenuAttributes
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

function updateMenu (req, res) {
  Menu.findById(req.params.orderID).then(Menu => {
    if (Menu == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una ordern con ID ${req.params.orderID}`
      })
    } else {
      Menu.update({
        deliberedAt: ((req.body.deliberedAt) ? req.body.deliberedAt : Menu.deliberedAt),
        CustomerID: ((req.body.CustomerID) ? req.body.CustomerID : Menu.CustomerID)
      }).then(() => {
        res.status(200).send({
          found: true,
          updated: true,
          Menu: Menu.dataValues
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          found: true,
          updated: false,
          message: `Error interno al guardar el Menu`
        })
      })
    }
  })
}
function deleteMenu (req, res) {
  Menu.findById(req.params.menuID).then(Menu => {
    if (Menu == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro una menu con ID ${req.params.menuID}`
      })
    } else {
      Menu.destroy()
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
          message: `Error interno al eliminar el menu`
        })
      })
    }
  })
}

module.exports = {
  updateMenu,
  getMenu,
  getMenus,
  deleteMenu,
  createMenu
}
