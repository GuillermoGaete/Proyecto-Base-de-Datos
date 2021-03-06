'use strict'
const logger = require('./helpers/logger')
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

sub.subscribe("readyMsgToClient")
sub.subscribe("createdMsgToClient")
logger.log(logger.BLUE, 'LISTENER', `Capturando mensajes a clientes`)
sub.on("message", function (channel, message) {
  if(channel=="readyMsgToClient"){
    logger.log(logger.BLUE, 'LISTENER', `READY - ${message}`)
  }
  if(channel=="createdMsgToClient"){
    logger.log(logger.GREEN, 'LISTENER', `CREATED - ${message}`)
  }
})
