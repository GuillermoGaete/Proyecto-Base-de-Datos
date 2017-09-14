'use strict'

const express = require('express')
const bodyParser = require('body-parser') // midleware para parsear peticiones HTTP
const app = express()
const port = process.env.PORT || 3000 // cargo el puerto en el que voy a correr mi app, por defecto es el 3000
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config/app/config.json')[env]

const conn = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

conn
  .authenticate()
  .then(() => {
    console.log('Conexion a la base de datos establecida correctamente.')
  })
  .catch(err => {
    console.error('No se puedo conectar a la base de datos:', err)
  })

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

app.put('/api/order/:orderID', (req, res) => {

})

app.delete('/api/order/:orderID', (req, res) => {

})
// Pongo la aplicacion a correr en el puerto que corresponde
app.listen(3000, () => {
  console.log(`API REST corriendo en http://localhost:${port}`)
})
