'use strict'

const express = require('express')
const api = express.Router()
const CustomerController = require('../controllers/customer')
const OrderController = require('../controllers/order')

api.post('/customer', CustomerController.createCustomer)

api.get('/customer/:customerID', CustomerController.getCustomer)

api.get('/customers(/:limit)?', CustomerController.getCustomers)

api.put('/customer/:customerID', CustomerController.updateCustomer)

api.delete('/customer/:customerID', CustomerController.deleteCustomer)

api.post('/order', OrderController.createOrder)

// TODO api.get('/customer/:customerID', CustomerController.getCustomer)

// TODO api.get('/customers/:limit', CustomerController.getCustomers)

// TODO api.put('/customer/:customerID', CustomerController.updateCustomer)

// TODO api.delete('/customer/:customerID', CustomerController.deleteCustomer)

module.exports = api
