const express = require('express')
const bodyParser = require('body-parser') // midleware para parsear peticiones HTTP
const app = express()
const CustomerController = require('./controllers/customer')

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

app.post('/api/customer', CustomerController.createCustomer)

app.get('/api/customer/:customerID', CustomerController.getCustomer)

app.get('/api/customers', CustomerController.getCustomers)

app.put('/api/customer/:customerID', CustomerController.updateCustomer)

app.delete('/api/customer/:customerID', CustomerController.deleteCustomer)

module.exports = app
