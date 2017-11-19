'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'OrderStatus',
      {
        OrderStatusID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        OrderID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Order',
            key: 'OrderID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        deletedAt: {
          type: Sequelize.DATE(3),
          allowNull: true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE(3),
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE(3),
          allowNull: false
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('OrderStatus')
  }
}
