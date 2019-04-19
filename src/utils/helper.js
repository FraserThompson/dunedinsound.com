// This file used RequireJS because in gatsby-node.js we have to use this (for some reason, I should revisit this)

import AwesomeDebouncePromise from 'awesome-debounce-promise'

const toMachineName = (string, space_character) => {
  space_character = space_character || "_";
  return string.toLowerCase().replace(/[!,.']/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z');
}

const nodeTypeToHuman = (string) => {
  switch (string) {
    case "gigs":
      return "Gig";
    case "blog":
      return "Blog";
    case "venues":
      return "Venue";
    case "artists":
      return "Artist";
  }
}

const postFilter = (needle, haystack) =>
  haystack.filter(({node}) => {
    const titleResult = node.frontmatter.title.toLowerCase().includes(needle)
    const artistResult = node.frontmatter.artists && node.frontmatter.artists.map(({name}) => name.toLowerCase()).join(" ").includes(needle)
    return titleResult || artistResult
  })
const postFilterDebounced = AwesomeDebouncePromise(postFilter, 50);

const shuffleFilter = (needle, shuffleInstance) =>
  shuffleInstance.filter((element) => {
    return element.getAttribute('title').toLowerCase().indexOf(needle) !== -1;
  });
const shuffleFilterDebounced = AwesomeDebouncePromise(shuffleFilter, 50);

// For easily constructing a regex to find media from a particular gig, artist, or any
//
// The constructor takes a gig name, artist name, and fileType. "gig" and "artist" are optional,
// if omitted it will find media from ANY gig or ANY artist.
//
// Call the create() method to return the regex.
// (afaik this isn't used anymore and will be removed soon)
class gigPathRegex {
  constructor({gig = "(.*?)", artist = "(.*?)", fileType}) {
    this.artist = artist;
    this.gig = gig;
    this.fileType = fileType;
  }

  create() {
    return "/" + this.gig + "\\/" + this.artist + "\\/" + "(.*?)." + this.fileType + "$/"
  }
}

// Sort an array by text month
const sortByMonth = (a, b) => {
  const allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return allMonths.indexOf(a) > allMonths.indexOf(b)
}

export { toMachineName, nodeTypeToHuman, gigPathRegex, sortByMonth, postFilterDebounced, shuffleFilterDebounced }
