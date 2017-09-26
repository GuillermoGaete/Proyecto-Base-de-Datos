const Order = require('../models/order')
// const moment = require('moment')

// function getOrder (req, res) {
//   Order.findById(req.params.OrderID).then(Order => {
//     if (Order == null) {
//       res.status(404).send({
//         found: false,
//         message: `No se encontro un Order con ID ${req.params.OrderID}`
//       })
//     } else {
//       res.status(200).send({
//         found: true,
//         Order: Order
//       })
//     }
//   })
// }
// function getOrders (req, res) {
//   var limit = ((req.params.number < 100) ? req.params.number : 100)
//   Order.findAll({limit: limit})
//   .then((Orders) => {
//     if (Orders.length !== 0) {
//       res.status(200).send({
//         found: true,
//         Orders: Orders
//       })
//     } else {
//       res.status(200).send({
//         found: false
//       })
//     }
//   })
//   .catch((err) => {
//     console.log(`Error al buscar los Orders: ${err}`)
//     res.status(500).send({
//       message: 'Error al realizar la busqueda'
//     })
//   })
// }

function createOrder (req, res) {
  const order = Order.build({
    OrderID: req.body.OrderID
  })
  order.save()
    .then(() => Order.findOrCreate({where: {OrderID: req.body.OrderID}}))
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

// function updateOrder (req, res) {
//   Order.findById(req.params.OrderID).then(Order => {
//     if (Order == null) {
//       res.status(404).send({
//         found: false,
//         message: `No se encontro un Order con ID ${req.params.OrderID}`
//       })
//     } else {
//       Order.update({
//         Name: ((req.body.Name) ? req.body.Name : Order.Name),
//         Surname: ((req.body.Surname) ? req.body.Surname : Order.Surname),
//         Gender: ((req.body.Gender) ? req.body.Gender : Order.Gender),
//         BirthdayDate: ((req.body.BirthdayDate) ? req.body.BirthdayDate : Order.BirthdayDate),
//         Email: ((req.body.Email) ? req.body.Email : Order.Email)
//       }).then(() => {
//         res.status(200).send({
//           found: true,
//           updated: true,
//           Order: Order.dataValues
//         })
//       })
//       .catch((err) => {
//         console.log(err)
//         res.status(500).send({
//           found: true,
//           updated: false,
//           message: `Error interno al guardar el Order`
//         })
//       })
//     }
//   })
// }
// function deleteOrder (req, res) {
//   Order.findById(req.params.OrderID).then(Order => {
//     if (Order == null) {
//       res.status(404).send({
//         found: false,
//         message: `No se encontro un Order con ID ${req.params.OrderID}`
//       })
//     } else {
//       Order.destroy()
//       .then(() => {
//         res.status(200).send({
//           found: true,
//           destroyed: true
//         })
//       })
//       .catch((err) => {
//         console.log(err)
//         res.status(500).send({
//           found: true,
//           destroyed: false,
//           message: `Error interno al eliminar el Order`
//         })
//       })
//     }
//   })
// }

module.exports = {
  createOrder
}
