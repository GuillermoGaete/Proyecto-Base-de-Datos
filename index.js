'use strict'

const env = process.env.NODE_ENV || 'development'
const config = require('./config/app/config.json')[env]
const conn = require('./connection')
const app = require('./app')
const logger = require('./helpers/logger')
const routerPublishedChannels = require('./service/routerPublishedChannels')

conn
  .authenticate()
  .then(() => {
    logger.log(logger.GREEN, 'SERVER', `Conexion a la base de datos establecida correctamente`)
    // Pongo la aplicacion a correr en el puerto que corresponde
    app.listen(config.port, () => {
      logger.log(logger.GREEN, 'SERVER', `API REST corriendo en http://${config.host}:${config.port}`)
      routerPublishedChannels.init()
    })
  })
  .catch(err => {
    logger.log(logger.RED, 'SERVER', `No se puedo conectar a la base de datos: ${err}`)
  })
