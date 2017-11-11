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
          type: Sequelize.DATE
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
          type: Sequelize.DATE,
          allowNull:true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('Order')
  }
}
