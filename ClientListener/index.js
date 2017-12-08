'use strict'
const logger = require('./helpers/logger')
try{
  logger.log(logger.BLUE, 'LISTENER', `Capturando mensajes a clientes`)

  var Redis = require('redis')
  var bluebird = require('bluebird')

  bluebird.promisifyAll(Redis.RedisClient.prototype)
  bluebird.promisifyAll(Redis.Multi.prototype)

  const sub = Redis.createClient({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 'IPv4',           // 4 (IPv4) or 6 (IPv6)
  //password: 'auth',
    db: 10
  })

  sub.subscribe("msgToClient")
  sub.on("message", function (channel, message) {
    console.log(`NEW MESSAGE - ${message}`)
  })
  console.log(`LISTENER - Capturando mensajes a clientes`)

}catch(err){
  console.log(err)
}
