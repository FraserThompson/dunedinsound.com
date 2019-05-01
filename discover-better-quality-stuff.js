const fs = require('fs-extra'),
  fg = require('fast-glob'),
  path = require('path');

const good_jpgs = fg.sync('F:/Recordings/**/**/*.jpg');
console.log(good_jpgs);

fg('./src/content/gigs/**/**/*[^cover].jpg').then((files) => {
  files.forEach((file) => {
    const parsedPath = path.parse(file)
    const filename = parsedPath.name
    const matches = good_jpgs.find(item => {
      const parsedPath = path.parse(item)
      const good_filename = parsedPath.name
      return good_filename == filename
    })
    if (matches) console.log(matches);
  })
})
