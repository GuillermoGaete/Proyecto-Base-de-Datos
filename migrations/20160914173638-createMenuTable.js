
'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'Menu',
      {
        MenuID : {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        Description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        ShorDescription: {
          type: Sequelize.STRING,
          allowNull: false
        },
        Price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        DiscountPercentage: {
          type: Sequelize.DECIMAL(6,2),
          defaultValue: 0,
          allowNull: false
        },
        CategoryID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'CategoryMenu',
            key: 'CategoryID'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        ElaborationTimeMin: {
          type: Sequelize.INTEGER,
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
    queryInterface.dropTable('Menu')
  }
}
