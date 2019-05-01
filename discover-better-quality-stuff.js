const fs = require('fs-extra'),
  fg = require('fast-glob'),
  path = require('path'),
  md5File = require('md5-file');

// this gets all the original uncompressed files
// to do this is compares filenames, if there are duplicate filenames it then checks the path for the artist name
// it's pretty cool
function getOriginalFiles() {
  const good_jpgs = fg.sync('F:/Recordings/**/**/*.jpg');
  fg('./src/content/gigs/**/**/*[^cover|^vlcsnap].jpg').then((files) => {

    const multipleMatches = []

    files.forEach((file) => {

      const parsedPath = path.parse(file)
      const filename = parsedPath.name

      const matches = good_jpgs.filter(item => {
        const parsedPath = path.parse(item)
        const good_filename = parsedPath.name
        return good_filename == filename
      })

      // these are done so commented out
      if (matches.length == 1) {
        const other_size = fs.statSync(matches[0]).size
        const current_size = fs.statSync(file).size
        if (other_size > current_size) {
          fs.copyFile(matches[0], file)
          console.log("COPIED: " + matches[0] + " TO " + file)
        }
      }

      if (matches.length > 1) {

        const potentialMatchIndex = []

        matches.forEach((match, index) => {
          const artist = match.split("/")[2]
          if (file.includes(artist)) {
            potentialMatchIndex.push(index)
          }
        })

        if (potentialMatchIndex.length == 1) {
          const matchIndex = potentialMatchIndex[0]

          const other_size = fs.statSync(matches[matchIndex]).size
          const current_size = fs.statSync(file).size

          if (other_size > current_size) {
            fs.copyFile(matches[matchIndex], file)
            console.log("COPIED: " + matches[matchIndex] + " TO " + file)
          }
        } else if (potentialMatchIndex.length > 1) {
          multipleMatches.push(matches)
        }
      }
    })
    console.log("DONE");
    console.log(multipleMatches);

  })
}

//getOriginalFiles();

// this is just for checking what files I have left which are the compressed versions
function whatFilesAreSmall() {
  fg('./src/content/gigs/**/**/*[^cover].jpg').then((files) => {
    files.forEach((file) => {
      const current_size = fs.statSync(file).size
      if (current_size < 800000) {
        console.log(file)
      }
    })
  })
}

//whatFilesAreSmall();

// YO THIS ONE IS THE CRAZIEST
// it goes through the cover.jpg images and checks their MD5's against the original images from the old site
// this is because the cover is usually just one of the images renamed to cover
// so it does this just so it can find the filename THEN it checks all the original uncompressed images
// to find the one with teh same filename and then it copies it wtf
function findBiggerCovers() {
  const multipleMatches = []

  const good_jpgs = fg.sync('F:/Recordings/**/**/*.jpg');

  const covers = fg.sync('./src/content/gigs/**/**/cover.jpg');
  const cover_md5s = covers.reduce((obj, file) => {
    const md5 = md5File.sync(file)
    obj[md5] = file
    return obj;
  }, {})

  fg('G:/dev/dunedinsound/assets/img/**/**/*[^cover].jpg').then((files) => {
    const cover_keys = Object.keys(cover_md5s)
    files.forEach((file) => {

      const md5 = md5File.sync(file)
      const match = cover_keys.find((file) => file == md5)

      if (match) {
        const matching_cover = cover_md5s[match]

        const parsedPath = path.parse(file)
        const filename = parsedPath.name

        const good_matches = good_jpgs.filter(item => {
          const parsedPath = path.parse(item)
          const good_filename = parsedPath.name
          return good_filename == filename
        })

        if (good_matches.length == 1) {

          const cover_size = fs.statSync(matching_cover).size
          const good_size = fs.statSync(good_matches[0]).size

          if (good_size > cover_size) {
            fs.copyFile(good_matches[0], matching_cover)
            console.log("COPIED: " + good_matches[0] + " TO " + matching_cover)
          }

        } else if  (good_matches.length > 1) {
          const potentialMatchIndex = []

          good_matches.forEach((match, index) => {
            const artist = match.split("/")[2]
            if (file.includes(artist)) {
              potentialMatchIndex.push(index)
            }
          })

          if (potentialMatchIndex.length == 1) {
            const matchIndex = potentialMatchIndex[0]

            const cover_size = fs.statSync(matching_cover).size
            const good_size = fs.statSync(good_matches[matchIndex]).size

            if (good_size > cover_size) {
              fs.copyFile(good_matches[matchIndex], matching_cover)
              console.log("COPIED: " + good_matches[matchIndex] + " TO " + matching_cover)
            }
          }
        }
      }

    });
    console.log("DONE")
    console.log(multipleMatches);
  });
}

//findBiggerCovers();
