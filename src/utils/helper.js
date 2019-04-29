import { theme } from '../utils/theme'
import { stripUnit } from 'polished'

const toMachineName = (string, space_character) => {
  space_character = space_character || "_"
  return string.toLowerCase().replace(/[!,.']/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z')
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
  }
}

const graphqlGroupToObject = (queryResult, sortByName) => {
  return queryResult.reduce((obj, item) => {
    obj[item.fieldValue] = !sortByName ? item.edges : item.edges.slice().sort((a, b) =>  a.node.name < b.node.name ? -1 : 1 )
    return obj
  }, {})
}

const postFilter = (needle, haystack) => {
  if (!haystack[0].edges) {
    return haystack.filter(({node}) => {
      const titleResult = node.frontmatter.title.toLowerCase().includes(needle)
      const artistResult = node.frontmatter.artists && node.frontmatter.artists.map(({name}) => name.toLowerCase()).join(" ").includes(needle)
      return titleResult || artistResult
    })
  } else {
    return haystack.reduce((arr, {fieldValue, edges}) => {
      const filteredEdges = edges.filter(({node}) => {
        const titleResult = node.frontmatter.title.toLowerCase().includes(needle)
        const artistResult = node.frontmatter.artists && node.frontmatter.artists.map(({name}) => name.toLowerCase()).join(" ").includes(needle)
        return titleResult || artistResult
      })
      const newGroup = {fieldValue, edges: filteredEdges}
      if (filteredEdges.length !== 0) arr.push(newGroup)
      return arr
    }, [])
  }
}

const shuffleFilter = (needle, shuffleInstance) =>
  shuffleInstance.filter((element) => {
    return element.getAttribute('title').toLowerCase().indexOf(needle) !== -1
  });

const dateStrToDateObj = (date) => {
  const splitDate = date.split("-")
  return new Date("20" + splitDate[2], splitDate[1] - 1, splitDate[0])
}

// Decides when the header should change. On mobile this is the window minus the headerheight * the banner height as a decimal. On desktop it's just the window height * the banner height as a decimal.
const calculateScrollHeaderOffset = (window, modifierDesktop = 0, modifierMobile = 0) => {
  const bannerHeight = stripUnit(theme.default.defaultBannerHeight) / 100
  const mobileHeaderHeight = (stripUnit(theme.default.headerHeight) + stripUnit(theme.default.headerHeightMobile) * 16 - 10)
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

export { toMachineName, nodeTypeToHuman, sortByMonth, postFilter, shuffleFilter, graphqlGroupToObject, calculateScrollHeaderOffset, dateStrToDateObj }
