const fs = require('fs-extra'),
  fg = require('fast-glob'),
  path = require('path'),
  yaml = require('yaml'),
  md5File = require('md5-file');

// this gets all the original uncompressed files
// to do this is compares filenames, if there are duplicate filenames it then checks the path for the artist name
// it's pretty cool
const getOriginalFiles = () => {
  const good_jpgs = fg.sync('F:/Recordings/**/**/*.{jpg,JPG}');
  fg('G:/dev/dunedinsound-gatsby/src/content/gigs/**/**/*.{jpg,JPG}').then((files) => {

    const multipleMatches = []

    files.forEach((file) => {

      const parsedPath = path.parse(file)
      const filename = parsedPath.name.replace("-min", "").replace("_min", "")

      if (filename == "cover" || filename == "vlcsnap") return

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
          const artist = match.split("/")[2].toLowerCase().replace(" ", "_")
          if (file.toLowerCase().replace(" ", "_").includes(artist)) {
            if (match.includes("processed") || (!match.includes("eis") && !match.includes("optimized") && !match.includes("compressed"))) {
              potentialMatchIndex.push(index)
            }
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

// this is just for checking what files I have left which are the compressed versions
const whatFilesAreSmall = () => {
  fg('./src/content/gigs/**/**/*[^cover].jpg').then((files) => {
    files.forEach((file) => {
      const current_size = fs.statSync(file).size
      if (current_size < 800000) {
        console.log(file)
      }
    })
  })
}

// YO THIS ONE IS THE CRAZIEST
// it goes through the cover.jpg images and checks their MD5's against the original images from the old site
// this is because the cover is usually just one of the images renamed to cover
// so it does this just so it can find the filename THEN it checks all the original uncompressed images
// to find the one with teh same filename and then it copies it wtf
const findBiggerCovers = () => {
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

// This was basically just used once to correct an error I made copying files, but it's left here for posterity.
// It found MP3 files which were duplicates and deleted them
const findDuplicateMP3 = () => {
  fg('G:/dev/dunedinsound-gatsby/src/content/gigs/**/**/*.{mp3,json}').then((files) => {
    const processed = files.map((file) => file.replace(" - Full Set", ""))
    const duplicates = processed.reduce(function(acc, el, i, arr) {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
    }, []);
    duplicates.map((file) => {
      console.log("REMOVING: " + file);
      fs.removeSync(file)
    });
  })
}

// We had leftover fields on the artist YAML which we didn't want so this removed them.
const fixArtistYaml = () => {
  fg('G:/dev/dunedinsound-gatsby/src/content/artists/**/index.md').then((files) => {

    files.forEach((file) => {
      const loadedFile = fs.readFileSync(file)
      const frontmatter = loadedFile.toString().split("---")

      const parsed = yaml.parse(frontmatter[1])
      delete parsed['permalink']
      delete parsed['layout']
      delete parsed['parent']

      console.log(parsed)

      fs.writeFileSync(file, "---\n" + yaml.stringify(parsed, 2) + "---\n")
    })
  })
}

//findDuplicateMP3();
//whatFilesAreSmall();
//getOriginalFiles();
//findBiggerCovers();
//fixArtistYaml();
