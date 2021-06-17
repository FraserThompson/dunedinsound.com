/*
    copy-dev

    Copies code to dev directory.

    Usage: node copy-dev.js ["to" | "from"]
*/

const fs = require('fs-extra')

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

const sourceDir = '.'
const destDir = '../dunedinsound-minimal-dev'

const args = process.argv.slice(2)

devFiles.forEach((path) => {
  args[0] === 'to' ? fs.copySync(sourceDir + path, destDir + path) : fs.copySync(destDir + path, sourceDir + path)
})
