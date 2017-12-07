const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config/app/config.json')[env]

const conn = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging:false
})
module.exports = conn

const Order = require('./models/order')
const Menu = require('./models/menu')
const OrderMenu = require('./models/orderMenu')
const Ingredient = require('./models/ingredient')
const MenuIngredient = require('./models/menuIngredient')
const Customer = require('./models/customer')

Order.belongsToMany(Menu,
  {
    through:
    {
      model:OrderMenu,
      unique:false
    },
    foreignKey: 'OrderID'
})
Menu.belongsToMany(Order,
  {
    through:
    {
      model:OrderMenu,
      unique:false
    },
    foreignKey: 'MenuID'
})
Menu.belongsToMany(Ingredient, { as: 'Ingredients', through: MenuIngredient })
Ingredient.belongsToMany(Menu, { as: 'inMenues', through: MenuIngredient })

Order.belongsTo(Customer, { foreignKey: 'CustomerID' })
Customer.hasMany(Order, { foreignKey: 'CustomerID' })
