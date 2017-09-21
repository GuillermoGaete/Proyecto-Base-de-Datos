'use strict'

const express = require('express')
const api = express.Router()
const CustomerController = require('../controllers/customer')

api.post('/customer', CustomerController.createCustomer)

api.get('/customer/:customerID', CustomerController.getCustomer)

api.get('/customers/:limit', CustomerController.getCustomers)

api.put('/customer/:customerID', CustomerController.updateCustomer)

api.delete('/customer/:customerID', CustomerController.deleteCustomer)

module.exports = api
