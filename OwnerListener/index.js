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

sub.subscribe("buyMsgToOwner")
sub.subscribe("createdMsgToOwner")
sub.subscribe("cantSoldMsgToOwner")
sub.subscribe("infoStockChange")

logger.log(logger.BLUE, 'LISTENER', `Capturando mensajes a Owner`)
sub.on("message", function (channel, message) {
  if(channel=="createdMsgToOwner"){
    logger.log(logger.GREEN, 'LISTENER', `${message}`)
    return
  }
  if(channel=="buyMsgToOwner"){
    logger.log(logger.WHITE, 'LISTENER', `${message}`)
    return
  }
  if(channel=="cantSoldMsgToOwner"){
    logger.log(logger.RED, 'LISTENER', `${message}`)
    return
  }
  //logger.log(logger.BLUE, 'LISTENER', `${message}`)
  return
})
