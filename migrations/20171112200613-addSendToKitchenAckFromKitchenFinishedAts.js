'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'OrderMenu',
        'sendToKitchenAt',
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'OrderMenu',
        'ackFromKitchenAt',
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'OrderMenu',
        'finishedAt',
        {
          type: Sequelize.DATE,
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
