'use strict'

const express = require('express')
const bodyParser = require('body-parser') // midleware para parsear peticiones HTTP
const app = express()
const env = process.env.NODE_ENV || 'development'
const config = require('./config/app/config.json')[env]
const Customer = require('./models/customer')
const conn = require('./connection')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/api/order', (req, res) => {
  res.status(200).send({ products: [] })
})

app.get('/api/order/:orderID', (req, res) => {

})

app.post('/api/order', (req, res) => {
  console.log(req.body)
  res.status(200).send({message: 'Se cargo la orden correctamente'})
})

app.post('/api/customer', (req, res) => {
  console.log(req.body)
  Customer.create({
    Name: req.body.Name,
    Surname: req.body.Surname,
    Email: req.body.Email,
    Gender: true,
    BirthdayDate: req.body.BirthdayDate,
    MobilePhone: req.body.MobilePhone,
    SoftDeleted: false
  })
  .then(() => Customer.findOrCreate({where: {Name: req.body.Name}}))
  .spread((user, created) => {
    console.log(user.get({
      plain: true
    }))
    console.log(created)
    res.status(200).send({message: 'Se cargo el usuario correctamente'})
  })
  .catch(err => {
    console.error(`Error al guardar los valores: ${err}`)
    res.status(400).send({message: 'Se produjo un error inesperado'})
  })
})

app.get('/api/customer/:customerID', (req, res) => {
  Customer.findById(req.params.customerID).then(customer => {
    if (customer == null) {
      res.status(400).send({find: false})
    } else {
      res.status(200).send({
        find: true,
        customer: customer
      })
    }
  })
})

app.put('/api/order/:orderID', (req, res) => {

})

app.delete('/api/order/:orderID', (req, res) => {

})

conn
  .authenticate()
  .then(() => {
    console.log('Conexion a la base de datos establecida correctamente.')
    // Pongo la aplicacion a correr en el puerto que corresponde
    app.listen(config.port, () => {
      console.log(`API REST corriendo en http://${config.host}:${config.port}`)
    })
  })
  .catch(err => {
    console.error(`No se puedo conectar a la base de datos: ${err}`)
  })
