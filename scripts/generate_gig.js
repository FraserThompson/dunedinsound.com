/*
    GENERATE GIG.JS


    A NEW ERA IN PRODUCTIVITY

    LESS MIND NUMBING MONOTONY THE DAY AFTER A GIG

    HAIL OUR COMPUTER OVERLORDS


    Usage: node generate_gig.js
*/

const fs = require('fs-extra')
const rl = require('readline')

const getCurrentDatePrefix = () => {
  const d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1)
}

/*
    Turns an artist or gig name into a machine artist or gig name using the method we've settled on.
    Params: String (artist name), character to replace spaces with (defaults to _)
*/
const machine_name = (string, space_character) => {
  space_character = space_character || '_'
  return string
    .toLowerCase()
    .replace(/[!,.']/g, '')
    .replace(/\s/g, space_character)
    .replace(/[$]/g, 'z')
}

const create_artist_page = (artist) => {
  const artistTemplate = `title: ${artist}`

  const artistFile = `./src/content/artist/${machine_name(artist)}.yml`

  if (!fs.existsSync(artistFile)) {
    fs.writeFileSync(artistFile, artistTemplate)
    console.log('Created artist page for ' + artist)
  } else {
    console.log('Artist page already exists for ' + artist)
  }
}

const create_venue_page = (venue) => {
  const venueTemplate = `title: ${venue}`

  const venueFile = `./src/content/venue/${machine_name(venue)}.yml`
  if (!fs.existsSync(venueFile)) {
    fs.writeFileSync(venueFile, venueTemplate)
    console.log('Created venue page for ' + venue + '. You need to manually add co-ordinates, Fraser.')
  } else {
    console.log('Venue page already exists for ' + venue)
  }
}

/*
    Creates a template YAML file populated with all the artists and venue.
    Params: Date, Gig title, venue name, array of artists
*/
const create_gig_yaml = (date, gig, venue, artists) => {
  const yamlDate = date + ' 08:30:00 Z'

  const gigTemplate = `title: "${gig}"
date: ${yamlDate}
venue: ${machine_name(venue)}
artists:
  ${artists
    .map((artist, i) =>
      `
  - name: ${artist}
    vid:
      - link:
  `.trim()
    )
    .join('\n  ')}
`

  const gigName = `${date}-${machine_name(gig, '-')}`
  const gigFile = `./src/content/gig/${gigName}.yml`
  const gigMediaDir = `./src/media/gig/${gigName}`
  fs.ensureDirSync(gigMediaDir)

  artists.forEach((artist) => {
    const artistMediaDir = `${gigMediaDir}/${machine_name(artist)}`
    fs.ensureDirSync(artistMediaDir)
    create_artist_page(artist)
  })

  fs.writeFileSync(gigFile, gigTemplate)
  console.log('Created directory structure and YAML for ' + gig + ' at ' + venue)

  create_venue_page(venue)
}

const main = () => {
  var prompts = rl.createInterface(process.stdin, process.stdout)
  const default_date = getCurrentDatePrefix()

  console.log('Hello Fraser! Let me help you with that.')
  console.log('------------- GIG METADATA -------------')

  prompts.question('Date (default: ' + default_date + '):', (date) => {
    if (!date) date = default_date

    prompts.question('Title: ', (gig) => {
      if (!gig) console.log("You didn't enter anything...")

      prompts.question('Venue: ', (venue) => {
        if (!venue) console.log("You didn't enter anything...")

        prompts.question('Artists (comma separated): ', (artists) => {
          artists = artists.split(',')
          const trimmed_artists = artists.map((s) => s.trim())
          create_gig_yaml(date, gig, venue, trimmed_artists)
          process.exit()
        })
      })
    })
  })
}

main()
