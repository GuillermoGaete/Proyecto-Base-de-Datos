'use strict'
const faker = require('faker')
faker.locale = 'es'

const MenusList = [
  {
    category: 'sanguche',
    menus: [
      {
        Name: 'Sandwitch de JyQ',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'jamon',
          amount: 40
        },{
          Name:'queso',
          amount: 60
        },{
          Name:'pan arabe',
          amount: 30
        }]
      },
      {
        Name: 'Sadwitch de Salame y Queso',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'salame',
          amount: 50
        },{
          Name:'queso',
          amount: 60
        },{
          Name:'pan arabe',
          amount: 30
        }]
      }
    ]
  },
  {
    category: 'ensalada',
    menus: [
      {
        Name: 'Ensalda Cesar',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'lechuga',
          amount: 200
        },{
          Name:'queso',
          amount: 100
        },{
          Name:'couton',
          amount: 10
        },{
          Name:'pechuga',
          amount: 100
        },{
          Name:'salsa cesar',
          amount: 60
        }
        ]
      },
      {
        Name: 'Ensalada Mediterranea',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'lechuga',
          amount: 180
        },{
          Name:'queso',
          amount: 110
        },{
          Name:'couton',
          amount: 15
        },{
          Name:'salmon',
          amount: 80
        },{
          Name:'aceto',
          amount: 70
        }
        ]
      }
    ]
  },
  {
    category: 'postre',
    menus: [
      {
        Name: 'Flan',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'leche',
          amount: 250
        },{
          Name:'azucar',
          amount: 40
        },{
          Name:'huevo',
          amount: 4
        }]
      },
      {
        Name: 'Helado',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'helado - crema americana',
          amount: 200
        },{
          Name:'chocolate',
          amount: 40
        }
        ]
      }
    ]
  },
  {
    category: 'pasta',
    menus: [
      {
        Name: 'Ravioles',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'ravioles',
          amount: 200
        },{
          Name:'salsa de tomate',
          amount: 80
        },{
          Name:'queso rallado',
          amount: 40
        }]
      },
      {
        Name: 'Sorrentinos',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'sorrentinos',
          amount: 150
        },{
          Name:'salsa de tomate',
          amount: 70
        },{
          Name:'queso rallado',
          amount: 35
        }]
      }
    ]
  },
  {
    category: 'pizza',
    menus: [
      {
        Name: 'Pizza napolitana',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'tomate',
          amount: 200
        },{
          Name:'queso',
          amount: 300
        },{
          Name:'levadura',
          amount: 1
        },{
          Name:'harina',
          amount: 100
        }]
      },
      {
        Name: 'Pizza muzzarella',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'queso',
          amount: 300
        },{
          Name:'levadura',
          amount: 1
        },{
          Name:'harina',
          amount: 100
        }]
      }
    ]
  },
  {
    category: 'empanada',
    menus: [
      {
        Name: 'JyQ',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'queso',
          amount: 20
        },{
          Name:'tapa de empanada',
          amount: 1
        },{
          Name:'jamon',
          amount: 30
        }]
      },
      {
        Name: 'carne',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'carne picada',
          amount: 20
        },{
          Name:'tapa de empanada',
          amount: 1
        },{
          Name:'cebolla',
          amount: 30
        }]
      }
    ]
  },
  {
    category: 'milanesa',
    menus: [
      {
        Name: 'milanesa con pure',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'papa',
          amount: 150
        },{
          Name:'milanesa',
          amount: 100
        },{
          Name:'pan rallado',
          amount: 30
        },{
          Name:'huevo',
          amount: 1
        }]
      },
      {
        Name: 'milanesa con papas fritas',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'papa',
          amount: 150
        },{
          Name:'milanesa',
          amount: 100
        },{
          Name:'pan rallado',
          amount: 30
        },{
          Name:'huevo',
          amount: 1
        },{
          Name:'aceite',
          amount: 50
        }]
      }
    ]
  },
  {
    category: 'suprema',
    menus: [
      {
        Name: 'suprema napolitana con pure',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'papa',
          amount: 150
        },{
          Name:'pollo',
          amount: 100
        },{
          Name:'pan rallado',
          amount: 30
        },{
          Name:'huevo',
          amount: 1
        },{
          Name:'tomate',
          amount: 100
        }]
      },
      {
        Name: 'suprema con papas fritas',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1))),
        Ingredients:[{
          Name:'papa',
          amount: 150
        },{
          Name:'pechuga',
          amount: 100
        },{
          Name:'pan rallado',
          amount: 30
        },{
          Name:'huevo',
          amount: 1
        },{
          Name:'aceite',
          amount: 50
        }]
      }
    ]
  }
]

module.exports = MenusList
