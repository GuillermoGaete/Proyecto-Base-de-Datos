const env = process.env.NODE_ENV || 'development'
const config = require('../../config/app/config.json')[env]
const SerialPort = require('serialport')
const Delimiter = SerialPort.parsers.Delimiter
const readline = require('readline')
const logger = require('./logger')
const redisClient = require('../../service/redisClient')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const rp = require('request-promise')

//TODO - refactor this code, logic to recursive reading from REDIS queque

function processMessages(channel,message){
  if(channel=="toKitchen"){
    logger.log(logger.GREEN, 'SERVER', `Llegaron ${message} ordenes para preparar`)
    recursiveInsert("menuesToKitchen")
  }
  if(channel=="getTimes"){
    logger.log(logger.GREEN, 'SERVER', `Pedido de tiempos para queque ${message}`)
  }
}

function recursiveInsert(list){
  redisClient.Client.lpopAsync(list).then(readed=>readedFromQueque(list,readed))
  .catch((err) =>{
    console.log(err)
  })
}

function continueReading(list,readed){
    setTimeout(function(){
      recursiveInsert(list)
    }, 500)
}
function readedFromQueque(list,readed){
    if(readed){
      var menu=JSON.parse(readed)
      port.write(`{"action":2,"idMenu":${menu.menu},"idOrder":${menu.order},"elTime":${menu.elaborationTime},"idMsg":${menu.order}}`, function (err, result,list,readed) {
        if (err) {
          console.log('Error while sending message : ' + err)
        }
        if (result) {
          console.log('Response received after sending message : ' + result)
        }

      })
      continueReading(list,readed)
    }else{
      logger.log(logger.GREEN, 'SERVER', `Se procesaron todas las ordenes preparar`)
    }
}


var port=null
var parser=null
SerialPort.list(function (err, ports) {
  if (err) {
    console.log(`Se pprodujo un error ${err}`)
  }
  logger.log(logger.GREEN, 'INIT', 'Puertos disponibles:')
  ports.forEach(function (port, index) {
    if (port.vendorId) {
      logger.log(logger.GREEN, 'INIT', `#${index + 1} |Puerto:${port.comName} |pnpId: ${port.pnpId} |vendorId:${port.vendorId}`)
    }
  })
  rl.question('Seleccione el numero de puerto: ', (answer) => {
    port = new SerialPort(ports[answer - 1].comName)
    logger.log(logger.GREEN, 'SERVER', `Conectado a Arduino via: ${ports[answer - 1].comName}...`)
    parser = port.pipe(new Delimiter({ delimiter: Buffer.from('}') }))
    parser.on('data', data => processDataFromArduino(data))
    redisClient.sub.subscribe("toKitchen")
    redisClient.sub.subscribe("getTimes")
    redisClient.sub.on("message", function (channel, message) {
      redisClient.printSub(channel,message)
      processMessages(channel,message)
    })
  })
})

function processDataFromArduino(data){
  var fixedData = Buffer.concat([ data, Buffer.from('}') ])
  try {
    var options = { }
    var jsonData = JSON.parse(fixedData.toString())
    if (jsonData.hasOwnProperty('action') && jsonData.action === 'finish_order') {
      logger.log(logger.BLUE, 'ACTION', ' type: ' + jsonData.action + ' - order: ' + jsonData.order + ' - menu: ' + jsonData.menu + ' - queque: ' + jsonData.queque)
      const jsonDataSting = JSON.stringify(jsonData)
      redisClient.pub.publishAsync("readyFromKitchen",jsonDataSting).then((msg)=>{
        redisClient.printPub("readyFromKitchen",msg)
      })
    }
    if (jsonData.hasOwnProperty('action') && jsonData.action === 'order_inserted') {
      logger.log(logger.BLUE, 'ACTION', ' type: ' + jsonData.action + ' - order: ' + jsonData.order + ' - menu: ' + jsonData.menu + ' - queque: ' + jsonData.queque)
      const jsonDataSting = JSON.stringify(jsonData)
      redisClient.pub.publishAsync("ackFromKitchen",jsonDataSting).then((msg)=>{
        redisClient.printPub("ackFromKitchen",msg)
      })
    }
    if (jsonData.hasOwnProperty('info') && jsonData.info === 'times') {
      logger.log(logger.BLUE, 'INFO', ' type: ' + jsonData.info + ' - queque: ' + jsonData.queque + ' - header: ' + jsonData.timeHeader + ' - consumed: ' + jsonData.timeConsumed)
      const jsonDataSting = JSON.stringify(jsonData)
      redisClient.pub.publishAsync("ackFromKitchen",jsonDataSting).then((msg)=>{
        redisClient.printPub("ackFromKitchen",msg)
      })
    }
  } catch (e) {
    logger.log(logger.RED, 'ERROR', `Error al leer datos desde arduino - Error:${err}`)
  }
}
