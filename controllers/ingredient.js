const Ingredient = require('../models/ingredient')
const config = require('./config.json')
const MeasureUnit = require('../models/measureUnit')
const CategoryIngredient = require('../models/categoryIngredient')

function getIngredient (req, res) {
  Ingredient.findById(req.params.ingredientID, {
    include: [
      {
        model: MeasureUnit,
        attributes: ['Unit', 'UnitPluralShort', 'UnitShort', 'UnitPlural']
      },
      {
        model: CategoryIngredient,
        attributes: ['Name']
      }
    ],
    attributes: ['Name', 'CriticalStock']
  }).then(ingredient => {
    if (ingredient == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un ingredient con ID ${req.params.ingredientID}`
      })
    } else {
      res.status(200).send({
        found: true,
        ingredient: ingredient
      })
    }
  })
}
function getIngredients (req, res) {
  var limit = ((req.params.limit < config.maxLimitValue) ? req.params.limit : config.maxLimitValue)
  Ingredient.findAll({limit: Number(limit),
    include: [
      {
        model: MeasureUnit,
        attributes: ['Unit', 'UnitPluralShort', 'UnitShort', 'UnitPlural']
      },
      {
        model: CategoryIngredient,
        attributes: ['Name']
      }
    ],
    attributes: ['Name', 'CriticalStock']
  })
  .then((ingredients) => {
    if (ingredients.length !== 0) {
      res.status(200).send({
        found: true,
        ingredients: ingredients
      })
    } else {
      res.status(200).send({
        found: false
      })
    }
  })
  .catch((err) => {
    console.log(`Error al buscar los ingredients: ${err}`)
    res.status(500).send({
      message: 'Error al realizar la busqueda'
    })
  })
}

function createIngredient (req, res) {
  const ingredient = Ingredient.build({
    CategoryID: req.body.CategoryID,
    MeasureUnitID: req.body.MeasureUnitID,
    Name: req.body.Name,
    CriticalStock: req.body.CriticalStock
  })
  ingredient.save()
    .then(() => Ingredient.findOrCreate({where: {Name: req.body.Name}}))
    .spread((ingredient, created) => {
      res.status(200).send({
        created: true,
        message: 'Se cargo el ingredient correctamente',
        ingredient: ingredient
      })
    })
    .catch((err) => {
      console.error(`Error al guardar los valores: ${err}`)
      res.status(400).send({
        message: 'Se produjo un error inesperado'
      })
    })
}

function updateIngredient (req, res) {
  Ingredient.findById(req.params.ingredientID).then(ingredient => {
    if (ingredient == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un ingredient con ID ${req.params.ingredientID}`
      })
    } else {
      ingredient.update({
        CriticalStock: ((req.body.CriticalStock) ? req.body.CriticalStock : ingredient.CriticalStock),
        Name: ((req.body.Name) ? req.body.Name : ingredient.Name),
        MeasureUnitID: ((req.body.MeasureUnitID) ? req.body.MeasureUnitID : ingredient.MeasureUnitID)
      }).then(() => {
        res.status(200).send({
          found: true,
          updated: true,
          ingredient: ingredient.dataValues
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          found: true,
          updated: false,
          message: `Error interno al guardar el ingredient`
        })
      })
    }
  })
}
function deleteIngredient (req, res) {
  Ingredient.findById(req.params.ingredientID).then(ingredient => {
    if (ingredient == null) {
      res.status(404).send({
        found: false,
        message: `No se encontro un ingredient con ID ${req.params.ingredientID}`
      })
    } else {
      ingredient.destroy()
      .then(() => {
        res.status(200).send({
          found: true,
          destroyed: true
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          found: true,
          destroyed: false,
          message: `Error interno al eliminar el ingredient`
        })
      })
    }
  })
}

module.exports = {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient
}
