'use strict'
try{
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('StockInput', 'fullSpend', {
      allowNull: false,  // if its null then que order is required at the moment
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('StockInput', 'fullSpend')
  }
}
}catch(err){
  console.log(err)
}
