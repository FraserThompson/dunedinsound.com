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

const graphqlGroupToObject = (queryResult) => {
  return queryResult.reduce((obj, item) => {
    obj[item.fieldValue] = item.edges
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

// Sort an array by text month
const sortByMonth = (a, b) => {
  const allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return allMonths.indexOf(a) > allMonths.indexOf(b)
}

export { toMachineName, nodeTypeToHuman, sortByMonth, postFilter, shuffleFilter, graphqlGroupToObject, dateStrToDateObj }
