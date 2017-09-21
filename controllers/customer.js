const Customer = require('../models/customer')

function getCustomer (req, res) {
  Customer.findById(req.params.customerID).then(customer => {
    if (customer == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un customer con ID ${req.params.customerID}`
      })
    } else {
      res.status(200).send({
        found: true,
        customer: customer
      })
    }
  })
}
function getCustomers (req, res) {
  res.status(200).send({
    created: true,
    message: 'Se cargo el usuario correctamente'
  })
}
function createCustomer (req, res) {
  Customer.create({
    Name: req.body.Name,
    Surname: req.body.Surname,
    Email: req.body.Email,
    Gender: true,
    BirthdayDate: req.body.BirthdayDate,
    MobilePhone: req.body.MobilePhone
  })
  .then(() => Customer.findOrCreate({where: {Name: req.body.Name}}))
  .spread((user, created) => {
    console.log(user.get({
      plain: true
    }))
    console.log(created)
    res.status(200).send({
      created: true,
      message: 'Se cargo el usuario correctamente'
    })
  })
  .catch(err => {
    console.error(`Error al guardar los valores: ${err}`)
    res.status(400).send({
      created: false,
      message: 'Se produjo un error inesperado'
    })
  })
}
function updateCustomer (req, res) {
  Customer.findById(req.params.customerID).then(customer => {
    if (customer == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un customer con ID ${req.params.customerID}`
      })
    } else {
      customer.update({
        Name: ((req.body.Name) ? req.body.Name : customer.Name),
        Surname: ((req.body.Surname) ? req.body.Surname : customer.Surname),
        Gender: ((req.body.Gender) ? req.body.Gender : customer.Gender),
        BirthdayDate: ((req.body.BirthdayDate) ? req.body.BirthdayDate : customer.BirthdayDate),
        Email: ((req.body.Email) ? req.body.Email : customer.Email)
      }).then(() => {
        res.status(200).send({
          found: true,
          updated: true,
          customer: customer.dataValues
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          found: true,
          updated: false,
          message: `Error interno al guardar el customer`
        })
      })
    }
  })
}
function deleteCustomer (req, res) {
  Customer.findById(req.params.customerID).then(customer => {
    if (customer == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un customer con ID ${req.params.customerID}`
      })
    } else {
      customer.destroy()
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
          message: `Error interno al eliminar el customer`
        })
      })
    }
  })
}

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer
}
