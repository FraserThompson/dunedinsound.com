import { theme } from '../utils/theme'
import { stripUnit } from 'polished'

export const toMachineName = (string, space_character) => {
  space_character = space_character || '_'
  return string
    .toLowerCase()
    .replace(/[!,.']/g, '')
    .replace(/\s/g, space_character)
    .replace(/[$]/g, 'z')
}

export const scrollTo = (e, anchor, headerOffset, behavior) => {
  e && e.preventDefault() && e.stopPropagation()

  const element = typeof document !== 'undefined' && document.getElementById(anchor)
  if (!element) return

  if (!headerOffset) {
    element && element.scrollIntoView({ behavior: behavior || 'smooth' })
  } else {
    if (typeof window !== `undefined`) {
      const y = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, y - headerOffset)
    }
  }
}

export const timeToSeconds = (str) => {
  const a = str.split(':')
  return a.length == 2 ? +a[0] * 60 + +a[1] : +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
}

export const gridToSizes = (grid, maxSize) => {
  return `(max-width: ${theme.default.breakpoints.xs}) ${100 * (grid.xs / 12)}vw, (max-width: ${theme.default.breakpoints.md}) ${
    100 * (grid.md / 12)
  }vw, (max-width: ${theme.default.breakpoints.lg}) ${100 * (grid.lg / 12)}vw, ${100 * (grid.lg / 12)}vw`
}

export const nodeTypeToHuman = (string) => {
  switch (string) {
    case 'gigs':
      return 'Gig'
    case 'blog':
      return 'Article'
    case 'venues':
      return 'Venue'
    case 'artists':
      return 'Artist'
    case 'vaultsessions':
      return 'Vault Session'
  }
}
/**
 * Turns a Graphql group into a key value dict for easier access.
 *
 * @param {array} queryResult the query result eg. data.covers.group
 * @param {boolean} sortByName whether to sort by name too
 * @param {Function} fieldValueProcessor optional callback to process the dict key
 * @returns sorted key value object
 */
export const graphqlGroupToObject = (queryResult, sortByName, fieldValueProcessor) => {
  return queryResult.reduce((obj, item) => {
    const fieldValue = fieldValueProcessor ? fieldValueProcessor(item.fieldValue) : item.fieldValue
    obj[fieldValue] = !sortByName ? item.nodes : item.nodes.slice().sort((a, b) => (a.name < b.name ? -1 : 1))
    return obj
  }, {})
}

/**
 * Returns a key-value object which sums up the audio in a gig by artist, to be fed to the Player component.
 * @param {} audio
 * @returns
 */
export const gigAudioToObject = (audio) =>
  audio.reduce((obj, item) => {
    const machineName = item.fieldValue.split('/')[2]
    const grouped_audio = item.nodes.reduce((obj, item) => {
      // There appears to be a bug in the GraphQL extension filter which sometimes allows images to slip
      // through... So instead of pursuing that we'll just add this check here.
      if (item.ext !== '.json' && item.ext !== '.mp3') return obj

      const name = item.name.replace('.mp3', '') // because old audio file JSON has mp3 in the name

      if (!obj[name]) obj[name] = {}
      obj[name][item.ext] = item
      return obj
    }, {})

    obj[machineName] = Object.keys(grouped_audio).map((item) => grouped_audio[item])
    return obj
  }, {})

export const postFilter = (needle, haystack) => {
  const filterFunction = (node) => {
    const titleResult = node.title.toLowerCase().includes(needle)
    const artistResult =
      node.artists &&
      node.artists
        .map(({ name }) => name.toLowerCase())
        .join(' ')
        .includes(needle)
    const venueResult = node.venue && node.venue.replace(/_/g, ' ').includes(needle)
    return titleResult || artistResult || venueResult
  }

  if (!haystack[0].nodes) {
    return haystack.filter(filterFunction)
  } else {
    return haystack.reduce((arr, { fieldValue, nodes }) => {
      const filteredEdges = nodes.filter(filterFunction)
      const newGroup = { fieldValue, nodes: filteredEdges }
      if (filteredEdges.length !== 0) arr.push(newGroup)
      return arr
    }, [])
  }
}

export const dateStrToDateObj = (date) => {
  const splitDate = date.split('-')
  return new Date('20' + splitDate[2], splitDate[1] - 1, splitDate[0])
}

/*
  Decides when the header should change.
  If the banner element is on the page, just use the height of it.
  Otherwise do a calculation:
  - On mobile this is the window minus the headerheight * the banner height as a decimal.
  - On desktop it's just the window height * the banner height as a decimal.
*/
export const calculateScrollHeaderOffset = (window, modifierDesktop = 0, modifierMobile = 0) => {
  const bannerEl = document.querySelector('#top')
  const bannerHeight = stripUnit(theme.default.defaultBannerHeight) / 100 // assumes it's a vh unit
  const mobileHeaderHeight = stripUnit(theme.default.headerHeightMobile) + stripUnit(theme.default.subheaderHeight) // assumes they're px units
  if (window.innerWidth < stripUnit(theme.default.breakpoints.xs)) {
    if (bannerEl) {
      return bannerEl.offsetHeight - mobileHeaderHeight + modifierMobile
    } else {
      return (window.innerHeight - mobileHeaderHeight + modifierMobile) * bannerHeight
    }
  } else {
    if (bannerEl) {
      return bannerEl.offsetHeight + modifierDesktop
    } else {
      return (window.innerHeight + modifierDesktop) * bannerHeight
    }
  }
}

// Sort an array by text month
export const sortByMonth = (a, b) => {
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return allMonths.indexOf(a) > allMonths.indexOf(b)
}

export const getRandom = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
