'use strict'

const express = require('express')
const api = express.Router()
const CustomerController = require('../controllers/customer')
const OrderController = require('../controllers/order')
const IngredientController = require('../controllers/ingredient')

api.post('/customer', CustomerController.createCustomer)

api.get('/customer/:customerID', CustomerController.getCustomer)

api.get('/customers(/:limit)?', CustomerController.getCustomers)

api.put('/customer/:customerID', CustomerController.updateCustomer)

api.delete('/customer/:customerID', CustomerController.deleteCustomer)

api.post('/order', OrderController.createOrder)

api.get('/order/:orderID', OrderController.getOrder)

api.get('/orders(/:limit)?', OrderController.getOrders)

api.put('/order/:orderID', OrderController.updateOrder)

api.delete('/order/:orderID', OrderController.deleteOrder)

api.post('/ingredient', IngredientController.createIngredient)

api.get('/ingredient/:ingredientID', IngredientController.getIngredient)

api.get('/ingredients(/:limit)?', IngredientController.getIngredients)

api.put('/ingredient/:ingredientID', IngredientController.updateIngredient)

api.delete('/ingredient/:ingredientID', IngredientController.deleteIngredient)

module.exports = api
