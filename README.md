# dunedinsound.com

Media from gigs in Dunedin New Zealand and more.

## What have we got here 

### Components

(Mostly) generic React components which are used in `templates` and `pages`.

### Content

Artists, gigs, venues, blog posts and generic pages in Markdown format. These are rendered through `templates`.

### Pages

Standalone pages, usually they display links to `content`.

### Templates

Templates used as layouts for `content` to be displayed in

#### Templatetemplates

These are templates used by `templates`. Currently there's only one which is used by `artists` and `venues`.

### Utils

Random stuff. Theme contains all our theming variables used sitewide.

## How are content turned into pages?

Within `gatsby-node.js` exports.createPages queries all of our markdown and then we iterate over each returned object, do pre-processing, and create a page via `createPage()`.

## Schema

A gig folder in `content/gigs` contains an `index.md` with metadata, zero or more artist folders containing photos and audio for that artist, and a cover image.

**index.md**

* `title` is the name of the gig
* `date` is the date it happened
* `artists` is an array of objects with artist `name` and media
  * `vid` is array of video objects of `link` and `title`
* `venue` is the machine name of the venue
* `cover` is the path to the cover, usually ./cover.jpg

## Running in development
`gatsby develop`
