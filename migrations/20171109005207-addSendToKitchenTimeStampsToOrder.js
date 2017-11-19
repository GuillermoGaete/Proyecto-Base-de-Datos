'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Order', 'sendToKitchenAt', {
      allowNull: true,
      type: Sequelize.DATE(3)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Order', 'sendToKitchenAt')
  }
}
