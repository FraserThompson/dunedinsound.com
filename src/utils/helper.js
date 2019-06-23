import { theme } from '../utils/theme'
import { stripUnit } from 'polished'

const toMachineName = (string, space_character) => {
  space_character = space_character || "_"
  return string.toLowerCase().replace(/[!,.']/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z')
}

const gridToSizes = (grid, maxSize) => {
  return `(max-width: ${theme.default.breakpoints.xs}) ${100 * (grid.xs / 12)}vw, (max-width: ${theme.default.breakpoints.md}) ${100 * (grid.md / 12)}vw, (max-width: ${theme.default.breakpoints.lg}) ${100 * (grid.lg / 12)}vw, ${100 * (grid.lg / 12)}vw`
}

const nodeTypeToHuman = (string) => {
  switch (string) {
    case "gigs":
      return "Gig"
    case "blog":
      return "Blog"
    case "venues":
      return "Venue"
    case "artists":
      return "Artist"
    case "vaultsessions":
      return "Vault Session"
  }
}

const graphqlGroupToObject = (queryResult, sortByName) => {
  return queryResult.reduce((obj, item) => {
    obj[item.fieldValue] = !sortByName ? item.edges : item.edges.slice().sort((a, b) =>  a.node.name < b.node.name ? -1 : 1 )
    return obj
  }, {})
}

const postFilter = (needle, haystack) => {

  const filterFunction = ({node}) => {
    const titleResult = node.frontmatter.title.toLowerCase().includes(needle)
    const artistResult = node.frontmatter.artists && node.frontmatter.artists.map(({name}) => name.toLowerCase()).join(" ").includes(needle)
    const venueResult = node.frontmatter.venue && node.frontmatter.venue.replace(/_/g, " ").includes(needle);
    return titleResult || artistResult || venueResult;
  }

  if (!haystack[0].edges) {
    return haystack.filter(filterFunction)
  } else {
    return haystack.reduce((arr, {fieldValue, edges}) => {
      const filteredEdges = edges.filter(filterFunction);
      const newGroup = {fieldValue, edges: filteredEdges}
      if (filteredEdges.length !== 0) arr.push(newGroup)
      return arr
    }, [])
  }
}

const dateStrToDateObj = (date) => {
  const splitDate = date.split("-")
  return new Date("20" + splitDate[2], splitDate[1] - 1, splitDate[0])
}

// Decides when the header should change. On mobile this is the window minus the headerheight * the banner height as a decimal. On desktop it's just the window height * the banner height as a decimal.
const calculateScrollHeaderOffset = (window, modifierDesktop = 0, modifierMobile = 0) => {
  const bannerHeight = stripUnit(theme.default.defaultBannerHeight) / 100
  const mobileHeaderHeight = ((stripUnit(theme.default.headerHeight) * 16) + (stripUnit(theme.default.headerHeightMobile) * 16))
  if (window.innerWidth < stripUnit(theme.default.breakpoints.xs)) {
    return (window.innerHeight - mobileHeaderHeight + modifierMobile) * bannerHeight
  } else {
    return (window.innerHeight + modifierDesktop) * bannerHeight
  }
}

// Sort an array by text month
const sortByMonth = (a, b) => {
  const allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return allMonths.indexOf(a) > allMonths.indexOf(b)
}

export { toMachineName, nodeTypeToHuman, sortByMonth, postFilter, graphqlGroupToObject, calculateScrollHeaderOffset, dateStrToDateObj, gridToSizes }
