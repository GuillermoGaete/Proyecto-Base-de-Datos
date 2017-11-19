'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Order', 'requiredAt', {
      allowNull: true,  // if its null then que order is required at the moment
      type: Sequelize.DATE(3)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Order', 'requiredAt')
  }
}
