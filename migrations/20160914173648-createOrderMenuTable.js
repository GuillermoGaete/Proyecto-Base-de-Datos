'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'OrderMenu',
      {
        OrderMenuID: {
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
          onDelete: 'cascade',
          allowNull: false,
        },
        MenuID: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Menu',
            key: 'MenuID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade',
          allowNull: false,
        },
        Amount: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        deletedAt: {
          type: Sequelize.DATE(3),
          allowNull:true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE(3),
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE(3),
          allowNull: false,
        }
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('OrderMenu')
  }
}
