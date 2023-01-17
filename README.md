# dunedinsound.com

Media from gigs in Dunedin New Zealand and more.

## Running in development

`npm start`

### Using the minimal dev site

Because of the size of this thing, playing around with development can be difficult due to build times, even with incremental builds.

So I've made a minimal version which includes all of the code but only enough assets for testing. It's located up a directory in `dunedinsound-gatsby-minimal-dev`. A good workflow is to make all the code changes in the minimal dev version then copy them to this one.

To copy the code **from the main site to the minimal site** run:

`npm run copy-to-dev`

To copy the code **from the minimal site to the main site** run:

`npm run copy-from-dev`

These will only copy code and package.json, not assets or any other files.

## Build

`npm run build`

Beware that building from scratch (ie. from no public folder) takes a very long time because it has to go through all the images and resize/compress them.

### Why are we using our own `gatsby-plugin-s3`?

There's a breaking bug which causes large files to always be reuploaded. We can't switch to the full release until https://github.com/jariz/gatsby-plugin-s3/issues/59 is fixed

## Generating gig files and folder structure

I wrote a script to automate the tedious work of making files and folders.

`npm run generate`

## Process audio

1. Put audio into ./audio in a subfolder
2. Run `npm run audio`

## What have we got here

### Architecture

- We have the following entity types: `Gig`, `Venue`, `Artist`, and `Vaultsession`
- All entities are stored as YAML files in `src/content/[type]/[name].yml`
- Media related to entities is stored in `src/media/[type]/[name]` where `name` is the name of the related YAML file
- We also have the following types of pages which are stored as Markdown in `src/content/[type]/[name]/index.md`: `Blog`, `Page`

Each of these entity types has an associated template in `src/templates` which is used to generate a page in `gatsby-node.js`.

#### Gigs

- Gigs are stored as YAML files in `src/content/gigs/[name].yml`
- Media from each gig is stored in `src/content/media/gigs/[name]`
- Artist names in the gig YAML correspond to directories in the gig's media directory: `src/content/media/gigs/[name]/[artist-name]`

### Custom fields

Schema for each type is defined in `gatsby-node.js`. Additionally, we use `createNodeField` to create fields on each GraphQL node.

All Markdown nodes have the following fields:

- slug: The URL slug
- type: The type eg. gig, blog, etc
- parentDir: The name of the directory the file is in. Used to query for related media.

All YAML nodes have the following fields:

- slug: The URL slug
- type: The type eg. gig, blog, etc
- fileName: The name of the YAML file. Used to query for related media.

Gig YAML nodes have these additional fields used for sorting:

- year: The year
- month: The month
- yearAndMonth: The year and month
- venue: The venue machine name. Used to query for the related venue.
- artists: The list of artist names. Used to query for related artists.

All File nodes in `src/media` have these fields:

- parentDir: The name of the directory the file is in
- mediaDir: The name of the media directory eg. gig, blog, etc

### Components

(Mostly) generic React components which are used in `templates` and `pages`.

### Pages

Standalone pages, usually they display links to `content`.

### Utils

Random stuff. Theme contains all our theming variables used sitewide.
