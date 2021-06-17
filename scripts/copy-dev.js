/*
    copy-dev

    Copies code to dev directory.

    Usage: node copy-dev.js ["to" | "from"]
*/

const fs = require('fs-extra')
const rl = require('readline')

const devFiles = [
  '/src/components',
  '/src/pages',
  '/src/templates',
  '/src/assets',
  '/gatsby-browser.js',
  '/gatsby-config.js',
  '/gatsby-node.js',
  '/package.json',
  '/static',
]

const args = process.argv.slice(2)

const thisDir = '.'
const devDir = '../dunedinsound-minimal-dev'

const sourceDir = args[0] === 'to' ? thisDir : devDir
const destDir = args[0] === 'to' ? devDir : thisDir

var prompts = rl.createInterface(process.stdin, process.stdout)

prompts.question(`This will overwrite data in ${destDir} is this okay? y/n `, (answer) => {
  if (answer != 'y') process.exit()
  devFiles.forEach((path) => {
    fs.copySync(sourceDir + path, destDir + path)
  })
  process.exit()
})
