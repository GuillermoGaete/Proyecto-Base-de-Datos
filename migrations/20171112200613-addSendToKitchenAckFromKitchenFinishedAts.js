'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'OrderMenu',
        'sendToKitchenAt',
        {
          type: Sequelize.DATE(3),
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'OrderMenu',
        'ackFromKitchenAt',
        {
          type: Sequelize.DATE(3),
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'OrderMenu',
        'finishedAt',
        {
          type: Sequelize.DATE(3),
          allowNull: true
        }
      )
    ]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('OrderMenu', 'ackFromKitchenAt'),
      queryInterface.removeColumn('OrderMenu', 'sendToKitchenAt'),
      queryInterface.removeColumn('OrderMenu', 'finishedAt')
    ]
  }
}
