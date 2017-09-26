'use strict'
/*
  Funcion que retorna un set de 3 valores, la fecha de creacion de un registro, la de modificacion y la de eliminacion
  Como parametros recibe el rango de fechas de devolucion de fechas y el porcentaje de updates y delete
*/
function comparsionLogger (operator, Arg1, Arg2) {
  return console.log('Compare: ' + Arg1 + operator + Arg2)
}

module.exports = {
  comparsionLogger
}
