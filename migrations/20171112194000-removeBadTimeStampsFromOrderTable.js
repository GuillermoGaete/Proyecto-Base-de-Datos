'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Order', 'ackFromKitchenAt')
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Order', 'ackFromKitchenAt', {
      allowNull: true,
      type: Sequelize.DATE
    })
  }
}
