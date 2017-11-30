var Redis = require('redis')
var bluebird = require('bluebird')
const logger = require('../helpers/logger')

bluebird.promisifyAll(Redis.RedisClient.prototype)
bluebird.promisifyAll(Redis.Multi.prototype)

const Client = Redis.createClient({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  family: 'IPv4',           // 4 (IPv4) or 6 (IPv6)
//password: 'auth',
  db: 0
})
const sub = Redis.createClient({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  family: 'IPv4',           // 4 (IPv4) or 6 (IPv6)
//password: 'auth',
  db: 10
})
const pub = Redis.createClient({
  port: 6379,          // Redis port
  host: '127.0.0.1',   // Redis host
  family: 'IPv4',           // 4 (IPv4) or 6 (IPv6)
// password: 'auth',
  db: 10
})
function printInsertion(list,inserted,menuToRedis){
  logger.log(logger.BLUE, 'REDIS', `Insert in list:${list} - position: ${inserted} - Menu:${JSON.stringify(menuToRedis)}`)
}
function printErrorInsertion(list,err,menuToRedis){
  logger.log(logger.RED, 'REDIS', `Error try insert in list:${list} - err: ${err} - Menu:${JSON.stringify(menuToRedis)}`)
}
function printPub(channel,payload){
  logger.log(logger.BLUE, 'REDIS', `Publish new message in Channel: ${channel} - Message: ${payload}`)
}
function printSub(channel,payload){
  logger.log(logger.BLUE, 'REDIS', `New message in suscribed Channel: ${channel} - Message: ${payload}`)
}
module.exports = {
  Client,
  printInsertion,
  printErrorInsertion,
  printPub,
  printSub,
  pub,
  sub
}
