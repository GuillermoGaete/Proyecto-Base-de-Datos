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
const MeasureUnit = require('./models/measureUnit')
const StockOutput = require('./models/stockOutput')
const StockInput = require('./models/stockInput')
const MenuIngredient = require('./models/menuIngredient')
const Customer = require('./models/customer')

Order.belongsToMany(Menu,{
    through:
    {
      model:OrderMenu,
      unique:false
    },
    foreignKey: 'OrderID'
})

Menu.belongsToMany(Order,{
    through:
    {
      model:OrderMenu,
      unique:false
    },
    foreignKey: 'MenuID'
})

Menu.belongsToMany(Ingredient,{
    through:
    {
      model:MenuIngredient,
      unique:false
    },
    foreignKey: 'MenuID'
})

Ingredient.belongsToMany(Menu,{
    through:
    {
      model:MenuIngredient,
      unique:false
    },
    foreignKey: 'IngredientID'
})

StockOutput.belongsTo(Ingredient, { foreignKey: 'IngredientID' })
Ingredient.hasMany(StockOutput, { foreignKey: 'IngredientID' })

StockInput.belongsTo(Ingredient, { foreignKey: 'IngredientID' })
Ingredient.hasMany(StockInput, { foreignKey: 'IngredientID' })

Ingredient.belongsTo(MeasureUnit, { foreignKey: 'MeasureUnitID' })
MeasureUnit.hasMany(Ingredient, { foreignKey: 'MeasureUnitID' })

Order.belongsTo(Customer, { foreignKey: 'CustomerID' })
Customer.hasMany(Order, { foreignKey: 'CustomerID' })
