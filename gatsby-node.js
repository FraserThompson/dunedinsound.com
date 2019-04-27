// These are duplicated from helper.js because we can't do ES6 imports in gatsby-node.js but we want to do them everywhere else
const toMachineName = (string, space_character) => {
  space_character = space_character || "_";
  return string.toLowerCase().replace(/[!,.':?]/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z');
}
const graphqlGroupToObject = (queryResult) => {
  return queryResult.reduce((obj, item) => {
    obj[item.fieldValue] = item.edges
    return obj
  }, {})
}

const path = require('path')

const realFs = require('fs')
const gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(realFs)

// Takes the slug and returns the node type
getNodeType = (path) => {
  if (/\/gigs/.test(path)) return "gigs";
  if (/\/blog/.test(path)) return "blog";
  if (/\/venues/.test(path)) return "venues";
  if (/\/artists/.test(path)) return "artists";
  return "page"; //default to page
}

exports.createPages = ({ graphql, actions }) => {

  return graphql(
    `
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        group(field: fields___type) {
          fieldValue
          edges {
            node {
              fileAbsolutePath
              fields {
                slug
                type
                machine_name
                parentDir
              }
              frontmatter {
                title
                description
                bandcamp
                facebook
                website
                soundcloud
                date(formatString: "DD-MM-YY")
                artists { name }
                venue
                cover {
                  childImageSharp {
                    fluid(maxWidth: 2400) {
                      src
                      srcSet
                      aspectRatio
                      sizes
                      base64
                    }
                  }
                }
              }
            }
          }
        }
      }
      images: allFile( filter: {extension: {in: ["jpg", "JPG"]}, fields: { type: { eq: "gigs"}} } ) {
        group(field: fields___gigDir) {
          fieldValue
          edges {
            node {
              fields {
                parentDir
              }
              name
              publicURL
              childImageSharp {
                fluid(maxWidth: 2400) {
                  src
                  srcSet
                  aspectRatio
                  sizes
                  base64
                }
              }
            }
          }
        }
      }
      audio: allFile( filter: {extension: {in: ["mp3", "json"]}, fields: { type: { eq: "gigs"}} } ) {
        group(field: fields___gigDir) {
          fieldValue
          edges {
            node {
              fields {
                parentDir
              }
              name
              publicURL
              ext
            }
          }
        }
      }
    }
    `).then(result => {

      if (result.errors) {
        console.log(result.errors)
        reject(result.errors)
      }

      const { createPage } = actions

      const layouts = {
        gigs: path.resolve('./src/templates/gig.js'),
        blog: path.resolve('./src/templates/blog.js'),
        artists: path.resolve('./src/templates/artist.js'),
        venues: path.resolve('./src/templates/venue.js'),
        page: path.resolve('./src/templates/page.js')
      }

      // We split it into collections of nodes by type so we can treat them as seperate collections for the next/prev
      const nodesByType = graphqlGroupToObject(result.data.allMarkdownRemark.group)
      // So we can attach gig media to gigs here
      const imagesByGig = graphqlGroupToObject(result.data.images.group)
      const audioByGig = graphqlGroupToObject(result.data.audio.group)

      // So we can attach the stuff we've already queried here instead of having to query it on each page
      const artistsByName = nodesByType["artists"].reduce((obj, {node}) => {
        obj[node.frontmatter.title] = node;
        return obj;
      }, {})
      const venuesByName = nodesByType["venues"].reduce((obj, {node}) => {
        obj[node.fields.machine_name] = node;
        return obj;
      }, {})

      // This is called on each markdown node in each collection
      const createPages = (node, index, posts) => {

        const previous = index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node

        const context = {
          slug: node.fields.slug,
          previous,
          next,
          thisPost: node,
          machine_name: node.fields.machine_name,
          parentDir: node.fields.parentDir,
          title: node.frontmatter.title
        }

        if (node.frontmatter.artists) context.artists = node.frontmatter.artists.reduce((obj, artist) => {
          if (artistsByName[artist.name]) obj[artist.name] = artistsByName[artist.name]
          return obj
        }, {})

        if (node.frontmatter.venue) context.venue = venuesByName[node.frontmatter.venue]

        // We pre-process an object containing all media for a gig sorted by artist so we don't have to do this on clientside
        if (node.fields.type === "gigs"){

          if (imagesByGig[node.fields.parentDir]) {
            const imagesByGigByArtist = imagesByGig[node.fields.parentDir].reduce((obj, {node}) => {
              obj[node.fields.parentDir] = obj[node.fields.parentDir] || []
              obj[node.fields.parentDir].push(node.childImageSharp.fluid)
              return obj
            }, {})

            context.images = imagesByGigByArtist
          }

          if (audioByGig[node.fields.parentDir]) {
            const audioByGigByArtist = audioByGig[node.fields.parentDir].reduce((obj, {node}) => {
              const name = node.name.replace(".mp3", "")
              obj[node.fields.parentDir] = obj[node.fields.parentDir] || {}
              obj[node.fields.parentDir][name] = obj[node.fields.parentDir][name] || {}
              obj[node.fields.parentDir][name][node.ext] = node
              return obj
            }, {})

            context.audio = audioByGigByArtist
          }

        }

        createPage({
          path: node.fields.slug,
          component: layouts[node.fields.type],
          context: context,
        })

      }

      // Create pages.
      nodesByType['gigs'].forEach(({node}, index) => createPages(node, index, nodesByType['gigs']))
      nodesByType['blog'].forEach(({node}, index) => createPages(node, index, nodesByType['blog']))
      nodesByType['venues'].forEach(({node}, index) => createPages(node, index, nodesByType['venues']))
      nodesByType['artists'].forEach(({node}, index) => createPages(node, index, nodesByType['artists']))
      nodesByType['page'].forEach(({node}, index) => createPages(node, index,  nodesByType['page']))
    })
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  // We want to add fields indicating what folder media is in so we add a parentDir field
  // and a gigDir field if it's media part of gig
  if (node.internal.type === 'File') {

    switch (node.ext) {
      case ".mp3":
      case ".json":
      case ".jpg":
      case ".JPG":

        const parsedPath = path.parse(node.absolutePath)
        const parentDir = path.basename(parsedPath.dir)
        const nodeType = getNodeType(node.absolutePath)

        createNodeField({
          name: `parentDir`,
          node,
          value: parentDir
        })

        if (nodeType) {
          createNodeField({
            name: `type`,
            node,
            value: nodeType
          })
        }

        if (nodeType === "gigs") {
          const pathComponents = node.relativeDirectory.split("\\")
          if (pathComponents.length === 2) {
            const gigDir = pathComponents[0]
            createNodeField({
              name: `gigDir`,
              node,
              value: gigDir
            })
          }
        }

      break;
    }

  }
  // For the actual gig posts we need to add some fields
  else if (node.internal.type === `MarkdownRemark`) {

    const nodeType = getNodeType(node.fileAbsolutePath)
    const nodeTitle = nodeType === "gigs" ? toMachineName(node.frontmatter.title, "-") : toMachineName(node.frontmatter.title, "_") // to preserve URLs from old site
    const nodeSlug = "/" + nodeType + "/" + nodeTitle + "/"

    const parsedPath = path.parse(node.fileAbsolutePath)
    const parentDir = path.basename(parsedPath.dir)

    const date = new Date(node.frontmatter.date)
    const year = date.getFullYear()
    const month = date.getMonth()

    // So we can group and sort by these
    createNodeField({
      name: `year`,
      node,
      value: year
    })
    createNodeField({
      name: `month`,
      node,
      value: month
    })

    createNodeField({
      name: `machine_name`,
      node,
      value: toMachineName(node.frontmatter.title, "_")
    })
    createNodeField({
      name: `parentDir`,
      node,
      value: parentDir
    })
    createNodeField({
      name: `slug`,
      node,
      value: nodeSlug
    })
    createNodeField({
      name: `type`,
      node,
      value: nodeType
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // If production JavaScript and CSS build
  if (stage === 'build-javascript') {
    // Turn off source maps
    actions.setWebpackConfig({
      devtool: false,
    })
  } else if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /_closest.polyfill/,
            use: loaders.null(),
          },
          {
            test: /_customEvent.polyfill/,
            use: loaders.null(),
          }
        ],
      },
    })
  }
}
