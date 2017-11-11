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
    queryInterface.dropTable('MeasureUnit')
  }
}
