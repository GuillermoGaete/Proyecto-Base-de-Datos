'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'MeasureUnit',
      {
        MeasureUnitID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Unit: {
          type: Sequelize.STRING,
          allowNull: false
        },
        UnitShort: {
          type: Sequelize.STRING,
          allowNull: false
        },
        UnitPlural: {
          type: Sequelize.STRING,
          defaultValue: null
        },
        UnitPluralShort: {
          type: Sequelize.STRING,
          defaultValue: null
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
    queryInterface.dropTable('MeasureUnit')
  }
}
