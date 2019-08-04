const fs = require('fs-extra')

/* these are copied from generate_gig.js */
const getCurrentDatePrefix = () => {
  const d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1)
}

const machine_name = (string, space_character) => {
  space_character = space_character || '_'
  return string
    .toLowerCase()
    .replace(/[!,.']/g, '')
    .replace(/\s/g, space_character)
    .replace(/[$]/g, 'z')
}

const getAudioFiles = () => {
  const source = './audio'
  return fs.readdirSync(source, { withFileTypes: true }).map(dirent => dirent.name)
}

const main = () => {
  const audioFiles = getAudioFiles()
  audioFiles.forEach(filename => {
    const splitted = filename.split(' - ')
    const src = `./audio/${filename}`
    const destination = `./src/content/gigs/${getCurrentDatePrefix()}-${machine_name(splitted[0], '-')}/${machine_name(splitted[1].split('.')[0])}`
    if (fs.existsSync(destination)) {
      fs.copyFileSync(src, destination)
      console.log(`Copied ${src} to ${destination}`)
    }
  })
}

main()
