
'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'Customer',
      {
        CustomerID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        Surname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        Email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        MobilePhone: Sequelize.STRING,
        BirthdayDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        Gender:{
          type: Sequelize.BOOLEAN,
          allowNull: false,
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
    queryInterface.dropTable('Customer')
  }
}
