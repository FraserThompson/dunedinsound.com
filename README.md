# dunedinsound.com

Media from gigs in Dunedin New Zealand and more.

## Running in development

`gatsby develop`

### Using the minimal dev site

Because of the size of this thing, playing around with development can be difficult due to build times, even with incremental builds.

So I've made a minimal version which includes all of the code but only enough assets for testing. It's located up a directory in `dunedinsound-gatsby-minimal-dev`. A good workflow is to make all the code changes in the minimal dev version then copy them to this one.

To copy the code **from the main site to the minimal site** run:

`npm run copy-to-dev`

To copy the code **from the minimal site to the main site** run:

`npm run copy-from-dev`

These will only copy code and package.json, not assets or any other files.

## Build

`gatsby build`

Beware that building from scratch (ie. from no public folder) takes a veeery long time (like a day or two) because it has to go through all the images and resize/compress them.

(previously my custom Jekyll solution was much quicker...)

### Why are we holding back `gatsby-plugin-sharp`?

There's a bug with thumbnail generation in versions later than 2.3.13 where it will basically regenerate all thumbnails every time the build happens. When this is fixed we can move on https://github.com/gatsbyjs/gatsby/issues/20816

We also need to hold back `gatsby-transformer-sharp` and `gatsby-plugin-manifest` otherwise we run into issues with conflicting versions of Sharp.

Also the version of Sharp used by these older versions requires Python2 so we have to install a deprecated version of Python unfortunately.

### Why are we using our own `gatsby-plugin-s3`?

There's a breaking bug which causes large files to always be reuploaded. We can't switch to the full release until https://github.com/jariz/gatsby-plugin-s3/issues/59 is fixed

## Process audio

1. Put audio into ./audio in a subfolder
2. Run docker-compose up

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

- `title` is the name of the gig
- `date` is the date it happened
- `artists` is an array of objects with artist `name` and media
  - `vid` is array of video objects of `link` and `title`
- `venue` is the machine name of the venue
- `cover` is the path to the cover, usually ./cover.jpg
