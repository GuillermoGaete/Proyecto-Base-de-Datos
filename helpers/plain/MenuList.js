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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'Sadwitch de Salame y Queso',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'Ensalada Mediterranea',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'Helado',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'Sorrentinos',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'Pizza muzzarella',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'carne',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'milanesa con papas fritas',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
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
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      },
      {
        Name: 'suprema con papas fritas',
        Description: faker.lorem.sentence(),
        ShorDescription: faker.lorem.slug(),
        Price: (60 + (faker.random.number(10) * 12) + (faker.random.number(7) * (5.5))),
        DiscountPercentage: (faker.random.number(3) / 10) * faker.random.number(1),
        ElaborationTimeMin: (5 + (faker.random.number(2) * 4) + (faker.random.number(2) * (1)))
      }
    ]
  }
]

module.exports = MenusList
