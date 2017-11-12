const SerialPort = require('serialport')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const Delimiter = SerialPort.parsers.Delimiter
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
    var port = new SerialPort(ports[answer - 1].comName)
    console.log(`Escuchando en ${ports[answer - 1].comName}...`)
    const parser = port.pipe(new Delimiter({ delimiter: Buffer.from('}') }))

    parser.on('data', function (data) {
      var fixedData = Buffer.concat([ data, Buffer.from('}') ])
      try {
        var jsonData = JSON.parse(fixedData.toString())
        if (jsonData.hasOwnProperty('action') && jsonData.action === 'finish_order') {
          console.log(' action: ' + jsonData.action + ' - order: ' + jsonData.order + ' - queque: ' + jsonData.queque)

          if (jsonData.action === 'finish_order') {
            port.write('{"action":2,"idOrder":57,"elTime":6,"idMsg":12}', function (err, result) {
              if (err) {
                console.log('Error while sending message : ' + err)
              }
              if (result) {
                console.log('Response received after sending message : ' + result)
              }
            })
          }
        } else {
          console.log(jsonData)
        }
      } catch (e) {
        console.log(e)
      }
    })
  })
})
