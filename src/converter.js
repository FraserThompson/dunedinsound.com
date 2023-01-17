/**
 * This is ugly because it was written with the help of an AI.
 */

/* Write NodeJS code which renames files with the extension ".md" in all subdirectories to the name of the directory and then moves them one directory up? */
const fs = require('fs')
const path = require('path')
const dir = './content'
const mediaDir = './media'

const excludeDirs = ['blog', 'page', 'artist', 'venue', 'vaultsession']

function move(oldPath, newPath) {
  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      if (err.code === 'EXDEV') {
        copy()
      }
      return
    }
    console.log('Moving ' + oldPath + ' to ' + newPath)
  })

  function copy() {
    var readStream = fs.createReadStream(oldPath)
    var writeStream = fs.createWriteStream(newPath)

    readStream.on('error', callback)
    writeStream.on('error', callback)

    readStream.on('close', function () {
      fs.unlink(oldPath, callback)
    })

    readStream.pipe(writeStream)
  }
}

fs.readdir(dir, function (err, files) {
  if (err) throw err
  files.forEach(function (file) {
    const mediaType = file
    if (excludeDirs.includes(mediaType)) return
    console.log('Working on ' + mediaType)
    var parentDirPath = path.join(dir, mediaType)
    fs.stat(parentDirPath, function (err, stat) {
      if (err) throw err
      if (!stat.isFile()) {
        fs.readdir(parentDirPath, function (err, files) {
          if (err) throw err
          files.forEach(function (file) {
            const filePath = path.join(parentDirPath, file)
            const dirName = path.parse(filePath).name
            console.log('Working in ' + dirName)
            fs.stat(filePath, function (err, stat) {
              if (err) throw err
              if (stat.isDirectory()) {
                fs.readdir(filePath, function (err, files) {
                  if (err) throw err
                  files.forEach(function (file) {
                    const oldFilePath = path.join(filePath, file)
                    fs.stat(oldFilePath, function (err, stat) {
                      if (err) throw err

                      if (stat.isFile()) {
                        if (path.extname(file) === '.md' || path.extname(file) === '.mdx') {
                          // Rename to dir, remove delineators, and shift to parent
                          const newFilePath = path.join(parentDirPath, dirName + '.yml')

                          console.log('Copying ' + oldFilePath + ' to ' + newFilePath)

                          var lines = fs.readFileSync(oldFilePath, 'utf8').split('\n')

                          const filteredLines = lines.filter((line) => !line.includes('---'))

                          fs.writeFile(newFilePath, filteredLines.join('\n'), function (err) {
                            if (err) throw err
                          })
                        } else {
                          // Move media to media dir
                          const fileName = path.basename(oldFilePath)
                          const mediaDirPath = path.join(mediaDir, mediaType, dirName)
                          const newFilePath = path.join(mediaDirPath, fileName)
                          if (!fs.existsSync(mediaDirPath)) {
                            fs.mkdirSync(mediaDirPath, { recursive: true })
                          }
                          move(oldFilePath, newFilePath)
                        }
                      } else {
                        // Move media in subdirs to new directory
                        const subddirName = path.basename(oldFilePath)
                        const mediaDirPath = path.join(mediaDir, mediaType, dirName, subddirName)
                        if (!fs.existsSync(mediaDirPath)) {
                          fs.mkdirSync(mediaDirPath, { recursive: true })
                        }
                        fs.readdir(oldFilePath, function (err, files) {
                          files.forEach(function (file) {
                            const oldSubddirFilePath = path.join(oldFilePath, file)
                            const fileName = path.basename(oldSubddirFilePath)
                            const newSubbdirFilePath = path.join(mediaDirPath, fileName)
                            move(oldSubddirFilePath, newSubbdirFilePath)
                          })
                        })
                      }
                    })
                  })
                })
              }
            })
          })
        })
      }
    })
  })
})
