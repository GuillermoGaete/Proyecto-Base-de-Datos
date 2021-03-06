const colors = require('colors')
const GREEN = 0
const RED = 1
const BLUE = 2
const YELLOW = 3
const GRAY = 4
const WHITE = 5

function log (color, site, msg) {
  site = '[' + site + ']'
  if (color === GREEN) {
    console.log(`${site.green.bold} ${msg.green}`)
  }
  if (color === RED) {
    console.log(`${site.red.bold} ${msg.red}`)
  }
  if (color === BLUE) {
    console.log(`${site.blue.bold} ${msg.blue}`)
  }
  if (color === YELLOW) {
    console.log(`${site.yellow.bold} ${msg.yellow}`)
  }
  if (color === WHITE) {
    console.log(`${site.white.bold} ${msg.whie}`)
  }
  if (color === GRAY) {
    console.log(`${site.gray.bold} ${msg.gray}`)
  }
}

module.exports = {
  log,
  GREEN,
  RED,
  BLUE,
  YELLOW,
  GRAY,
  WHITE
}
