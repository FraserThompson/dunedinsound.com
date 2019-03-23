const machineName = function(string, space_character) {
  space_character = space_character || "_";
  return string.toLowerCase().replace(/[!,.']/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z');
}

// For easily constructing a regex to find media from a particular gig, artist, or any
//
// The constructor takes a gig name, artist name, and fileType. "gig" and "artist" are optional,
// if omitted it will find media from ANY gig or ANY artist.
//
// Call the create() method to return the regex.
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

module.exports = {
  machineName,
  GigPathRegex
}
