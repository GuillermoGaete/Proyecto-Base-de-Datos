'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'Order',
      {
        OrderID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        deliberedAt: {
          allowNull: true,
          type: Sequelize.DATE(3)
        },
        CustomerID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Customer',
            key: 'CustomerID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
          allowNull: false
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
    queryInterface.dropTable('Order')
  }
}
