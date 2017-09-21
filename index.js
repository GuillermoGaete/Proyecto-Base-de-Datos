'use strict'

const env = process.env.NODE_ENV || 'development'
const config = require('./config/app/config.json')[env]
const conn = require('./connection')
const app = require('./app')

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
