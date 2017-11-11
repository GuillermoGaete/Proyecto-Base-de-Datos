'use strict'

const connection =  require('../connection')
const faker = require('faker')
faker.locale = "es"
const moment=require('moment')
const config = require('../config/seeding/config.json')
const Customer = require('../models/customer')
const falseDates = require('../helpers/falsedates')

module.exports = {
  up: (queryInterface, Sequelize) => {
    var CustomersPromises=[]
    for(var i=0;i<=3000;i++){
      var RamdonUser = Customer.findOne({order: [ connection.fn( 'RAND' )]})
      CustomersPromises.push(RamdonUser)
    }

    return Promise.all(CustomersPromises).then(Customers => {
      var OrderList=[]
      Customers.forEach(function(Customer){
          var initUserActivity=moment(Customer.createdAt).format('MM-DD-YYYY')
          var dates=falseDates.getDates(initUserActivity,moment().format('MM-DD-YYYY'),0,0)
          var dateDeliberedOrder = faker.date.between(dates.createdAtDate,moment(dates.createdAtDate).add(2,'hours'))
          var deliberedAtNumber=faker.random.number(7)
          OrderList.push({
            deliberedAt:(deliberedAtNumber>2)?dateDeliberedOrder:null,
            CustomerID:Customer.CustomerID,
            deletedAt:dates.deteltedAtDate,
            createdAt:dates.createdAtDate,
            updatedAt:dates.updatetAtDate
          })
      })
      return queryInterface.bulkInsert('Order',OrderList, {})
    })
    .catch(err=>{
      console.log('Error al ejecutar la busqueda:'+err)
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Order', {}, {})
  }
}
