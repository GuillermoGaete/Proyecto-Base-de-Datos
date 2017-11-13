const express = require('express')
const bodyParser = require('body-parser') // midleware para parsear peticiones HTTP
const app = express()
const env = process.env.NODE_ENV || 'development'
const config = require('../../config/app/config.json')[env]
const SerialPort = require('serialport')
const Delimiter = SerialPort.parsers.Delimiter
const readline = require('readline')
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
  console.log('Puertos disponibles:')
  ports.forEach(function (port, index) {
    if (port.vendorId) {
      console.log(`#${index + 1} |Puerto:${port.comName} |pnpId: ${port.pnpId} |vendorId:${port.vendorId}`)
    }
  })
  rl.question('Seleccione el numero de puerto: ', (answer) => {
    app.listen(config.portArduinoAPI, () => {
      console.log(`API interna Arduino corriendo en http://${config.host}:${config.portArduinoAPI}`)
      var port = new SerialPort(ports[answer - 1].comName)
      console.log(`Conectado a Arduino via: ${ports[answer - 1].comName}...`)
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
        res.status(200).send({
          found: true
        })
      })

      parser.on('data', function (data) {
        var fixedData = Buffer.concat([ data, Buffer.from('}') ])
        try {
          var jsonData = JSON.parse(fixedData.toString())
          if (jsonData.hasOwnProperty('action') && jsonData.action === 'finish_order') {
            console.log(' action: ' + jsonData.action + ' - order: ' + jsonData.order + ' - menu: ' + jsonData.menu + ' - queque: ' + jsonData.queque)
          }
          if (jsonData.hasOwnProperty('action') && jsonData.action === 'order_inserted') {
            var options = {
              method: 'POST',
              uri: 'http://localhost:3000/order/ack',
              body: {
                Menu: jsonData.menu,
                Order: jsonData.order
              },
              json: true // Automatically stringifies the body to JSON
            }
            rp(options)
            .then(function (parsedBody) {
              console.log('enviado')
            })
          }
        } catch (e) {
          console.log(e)
        }
      })
    })
  })
})
