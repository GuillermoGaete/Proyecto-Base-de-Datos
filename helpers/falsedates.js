'use strict'
const faker = require('faker')
const moment = require('moment')
faker.locale = 'es'

/*
  Funcion que retorna un set de 3 valores, la fecha de creacion de un registro, la de modificacion y la de eliminacion
  Como parametros recibe el rango de fechas de devolucion de fechas y el porcentaje de updates y delete
*/
function getDates (initial, end, percerntUpdated, percentDeleted) {
  var randomNumber = Math.floor(Math.random() * 100) + 1
  var createdAtDate = faker.date.between(initial, end)
  var updatedAtDate = null
  if (randomNumber >= percerntUpdated) {
    updatedAtDate = createdAtDate
  } else {
    updatedAtDate = faker.date.between(moment(createdAtDate).format('MM-DD-YYYY'), moment(end, 'MM-DD-YYYY').add(1, 'days').format('MM-DD-YYYY'))
  }

  var deletedAtDate = null
  if (randomNumber >= percentDeleted) {
    deletedAtDate = null
  } else {
    deletedAtDate = faker.date.between(moment(updatedAtDate).format('MM-DD-YYYY'), moment(end, 'MM-DD-YYYY').add(2, 'days').format('MM-DD-YYYY'))
  }
  return {
    createdAtDate: createdAtDate,
    updatetAtDate: updatedAtDate,
    deteltedAtDate: deletedAtDate
  }
}

module.exports = {
  getDates
}
