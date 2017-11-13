const rp = require('request-promise')

function insertOrder (order) {
  var MenuesPromise = order.getMenues()
  var collectedPromise = Promise.all([MenuesPromise]).then(values => {
    const Menues = values[0]
    Menues.forEach(function (Menu) {
      var options = {
        method: 'POST',
        uri: 'http://localhost:3001/insertOrder',
        body: {
          Menu: Menu,
          Order: order
        },
        json: true // Automatically stringifies the body to JSON
      }
      rp(options)
      .then(function (parsedBody) {
      })
      .catch(function (err) {
        console.log('Error al enviar la orden al sistema de preparacion: ' + err.message)
      })
    })
  })
  return collectedPromise
}

module.exports = {
  insertOrder
}
