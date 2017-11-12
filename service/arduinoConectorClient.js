
function insertOrder (order) {
  var MenuesPromise = order.getMenues()
  var collectedPromise = Promise.all([MenuesPromise]).then(values => {
    const Menues = values[0]
    console.log(`Pre forEach`)
    Menues.forEach(function (Menu) {
      // pegarle con socket.io por cada Menu al servicio que inserta medianta Serie en arduino
      console.log(`Insetado un menu con ID${Menu.MenuID} que tarda ${Menu.ElaborationTimeMin} en estar listo`)
    })
  })
  return collectedPromise
}

module.exports = {
  insertOrder
}
