'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Order', 'sendToKitchenAt', {
      allowNull: true,
      type: Sequelize.DATE
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Order', 'sendToKitchenAt')
  }
}
