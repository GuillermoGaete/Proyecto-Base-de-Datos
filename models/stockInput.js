'use strict';

const Sequelize = require('sequelize');
const Conection = require('../connection');

const StockInput = Conection.define('StockInput', {
    StockInputID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    boughtAt: {
        type: Sequelize.DATE(3),
        allowNull: false
    },
    IngredientID: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Ingredient',
            key: 'IngredientID'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
        allowNull: false
    }
},
{
    freezeTableName: true,
    paranoid: true
}
);


module.exports = StockInput;
