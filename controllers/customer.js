const Customer = require('../models/customer')
const moment = require('moment')
const config = require('./config.json')

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
  var limit = ((req.params.limit < config.maxLimitValue) ? req.params.limit : config.maxLimitValue)
  Customer.findAll({limit: Number(limit)})
  .then((customers) => {
    if (customers.length !== 0) {
      res.status(200).send({
        found: true,
        customers: customers
      })
    } else {
      res.status(200).send({
        found: false
      })
    }
  })
  .catch((err) => {
    console.log(`Error al buscar los customers: ${err}`)
    res.status(500).send({
      message: 'Error al realizar la busqueda'
    })
  })
}

function createCustomer (req, res) {
  const BirthdayDate = moment(req.body.BirthdayDate)
  const customer = Customer.build({
    Name: req.body.Name,
    Surname: req.body.Surname,
    Email: req.body.Email,
    Gender: true,
    BirthdayDate: BirthdayDate,
    MobilePhone: req.body.MobilePhone
  })
  customer.save()
    .then(() => Customer.findOrCreate({where: {Name: req.body.Name}}))
    .spread((user, created) => {
      res.status(200).send({
        created: true,
        message: 'Se cargo el customer correctamente',
        customer: customer
      })
    })
    .catch((err) => {
      console.error(`Error al guardar los valores: ${err}`)
      res.status(400).send({
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
