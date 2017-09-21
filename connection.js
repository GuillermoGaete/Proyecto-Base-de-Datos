const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config/app/config.json')[env]

const conn = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

module.exports = conn
