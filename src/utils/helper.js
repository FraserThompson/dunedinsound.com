const machineName = (string, space_character) => {
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

// For easily constructing a regex to find media from a particular gig, artist, or any
//
// The constructor takes a gig name, artist name, and fileType. "gig" and "artist" are optional,
// if omitted it will find media from ANY gig or ANY artist.
//
// Call the create() method to return the regex.
// (afaik this isn't used anymore and will be removed soon)
class GigPathRegex {
  constructor({gig = "(.*?)", artist = "(.*?)", fileType}) {
    this.artist = artist;
    this.gig = gig;
    this.fileType = fileType;
  }

  create() {
    return "/" + this.gig + "\\/" + this.artist + "\\/" + "(.*?)." + this.fileType + "$/"
  }
}

const sortByMonth = (a, b) => {
  const allMonths = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return allMonths.indexOf(a) > allMonths.indexOf(b)
}

module.exports = {
  machineName,
  nodeTypeToHuman,
  GigPathRegex,
  sortByMonth
}
