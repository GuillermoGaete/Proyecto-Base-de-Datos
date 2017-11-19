const express = require('express')
const bodyParser = require('body-parser') // midleware para parsear peticiones HTTP
const app = express()
const env = process.env.NODE_ENV || 'development'
const config = require('../../config/app/config.json')[env]
const SerialPort = require('serialport')
const Delimiter = SerialPort.parsers.Delimiter
const readline = require('readline')
const logger = require('./logger')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const rp = require('request-promise')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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
    app.listen(config.portArduinoAPI, () => {
      logger.log(logger.GREEN, 'SERVER', `API interna Arduino corriendo en http://${config.host}:${config.portArduinoAPI}`)
      var port = new SerialPort(ports[answer - 1].comName)
      logger.log(logger.GREEN, 'SERVER', `Conectado a Arduino via: ${ports[answer - 1].comName}...`)
      const parser = port.pipe(new Delimiter({ delimiter: Buffer.from('}') }))

      app.post('/insertOrder', (req, res) => {
        const Menu = req.body.Menu
        const Order = req.body.Order
        port.write(`{"action":2,"idMenu":${Menu.MenuID},"idOrder":${Order.OrderID},"elTime":${Menu.ElaborationTimeMin},"idMsg":${Order.OrderID}}`, function (err, result) {
          if (err) {
            console.log('Error while sending message : ' + err)
          }
          if (result) {
            console.log('Response received after sending message : ' + result)
          }
        })
        // TODO tiene problemas para manejar muchas ordenes, la solucion es ponerla en una fila y retirarla al recibir la confirmacion desde Arduino.
        // en esta ruta solo informar la recepcion por parte del servidor
        // corregir lo que esta haciendo arduinoConectorClient que no esta bien tampoco
        res.status(200).send({
          recived: true
        })
      })

      parser.on('data', function (data) {
        var fixedData = Buffer.concat([ data, Buffer.from('}') ])
        try {
          var options = { }
          var jsonData = JSON.parse(fixedData.toString())
          if (jsonData.hasOwnProperty('action') && jsonData.action === 'finish_order') {
            logger.log(logger.BLUE, 'ACTION', ' type: ' + jsonData.action + ' - order: ' + jsonData.order + ' - menu: ' + jsonData.menu + ' - queque: ' + jsonData.queque)
            options = {
              method: 'PUT',
              uri: 'http://localhost:3000/api/order-menu/finished',
              body: {
                Menu: jsonData.menu,
                Order: jsonData.order
              },
              json: true // Automatically stringifies the body to JSON
            }
            rp(options)
            .then(function (parsedBody) {
              logger.log(logger.GREEN, 'INFO', `Finalizacion informada al servidor correctamente`)
            })
            .catch((err) => {
              logger.log(logger.RED, 'ERROR', `Error al informar que la orden finalizo correctamente - Error:${err}`)
            })
          }
          if (jsonData.hasOwnProperty('action') && jsonData.action === 'order_inserted') {
            logger.log(logger.BLUE, 'ACTION', ' type: ' + jsonData.action + ' - order: ' + jsonData.order + ' - menu: ' + jsonData.menu + ' - queque: ' + jsonData.queque)
            options = {
              method: 'PUT',
              uri: 'http://localhost:3000/api/order-menu/ack',
              body: {
                Menu: jsonData.menu,
                Order: jsonData.order
              },
              json: true // Automatically stringifies the body to JSON
            }
            rp(options)
            .then(function (parsedBody) {
              logger.log(logger.GREEN, 'INFO', `Insercion informada al servidor correctamente`)
            })
            .catch((err) => {
              logger.log(logger.RED, 'ERROR', `Error al informar que la orden se inserto correctamente - Error:${err}`)
            })
          }
        } catch (e) {
          console.log(e)
        }
      })
    })
  })
})
