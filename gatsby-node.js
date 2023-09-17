// These are duplicated from helper.js because we can't do ES6 imports in gatsby-node.js but we want to do them everywhere else
const toMachineName = (string, space_character) => {
  space_character = space_character || '_'
  return string
    .toLowerCase()
    .replace(/[!,.':#?]/g, '')
    .replace(/\s/g, space_character)
    .replace(/[$]/g, 'z')
}

const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      {
        pages: allMdx(sort: { frontmatter: { date: DESC } }) {
          group(field: { fields: { type: SELECT } }) {
            fieldValue
            nodes {
              fields {
                slug
                type
                parentDir
              }
              internal {
                contentFilePath
              }
              frontmatter {
                title
                template
                tags
                gallery
                related_gigs
              }
            }
          }
        }
        allGigs: allGigYaml(sort: { date: DESC }) {
          nodes {
            title
            venue
            artists {
              name
            }
            fields {
              slug
              fileName
              type
            }
          }
        }
        allVenues: allVenueYaml {
          nodes {
            title
            fields {
              slug
              fileName
              type
            }
          }
        }
        allArtists: allArtistYaml {
          nodes {
            title
            fields {
              slug
              fileName
              type
            }
          }
        }
        allVaultsessions: allVaultsessionYaml {
          nodes {
            title
            fields {
              slug
              fileName
              type
            }
          }
        }
        blogsByTag: allMdx(sort: { frontmatter: { date: DESC } }, filter: { fields: { type: { eq: "blog" } } }) {
          group(field: { frontmatter: { tags: SELECT } }) {
            fieldValue
            totalCount
          }
        }
      }
    `
  )

  if (result.errors) {
    console.log(result.errors)
  }

  const { createPage } = actions

  const layouts = {
    gig: path.resolve('./src/templates/gig/gig.js'),
    blog: path.resolve('./src/templates/blog/blog.js'),
    artist: path.resolve('./src/templates/artist/artist.js'),
    venue: path.resolve('./src/templates/venue/venue.js'),
    vaultsession: path.resolve('./src/templates/vaultsession/vaultsession.js'),
    page: path.resolve('./src/templates/page/page.js'),
    tags: path.resolve('./src/templates/tags/tags.js'),
  }

  // Markdown pages
  const createMdx = (group) => {
    group.nodes.forEach((node, index) => {
      const previous = index === group.nodes.length - 1 ? null : group.nodes[index + 1]
      const next = index === 0 ? null : group.nodes[index - 1]

      const context = {
        slug: node.fields.slug,
        previous,
        next,
        parentDir: node.fields.parentDir,
        title: node.frontmatter.title,
        tags: node.frontmatter.tags || [],
        related_gigs: node.frontmatter.related_gigs || [],
        isGallery: node.frontmatter.gallery ? true : false,
      }

      let component = layouts[node.fields.type]
      if (node.frontmatter.template) component = path.resolve(`./src/templates/${node.frontmatter.template}`)

      createPage({
        path: node.fields.slug,
        component: `${component}?__contentFilePath=${node.internal.contentFilePath}`,
        context: context,
      })
    })
  }

  // Yaml entities
  const createYml = (node, index, nodes) => {
    const previous = index === nodes.length - 1 ? null : nodes[index + 1]
    const next = index === 0 ? null : nodes[index - 1]

    const context = {
      previous,
      next,
      slug: node.fields.slug,
      fileName: node.fields.fileName,
      type: node.fields.type,
      title: node.title,
    }

    if (node.venue) context.venue = node.venue
    if (node.artists) context.artists = node.artists.map((artist) => artist.name)

    const component = layouts[node.fields.type]

    createPage({
      path: node.fields.slug,
      component: `${component}`,
      context: context,
    })
  }

  // Yaml pages
  result.data.allGigs.nodes.forEach(createYml)
  result.data.allVenues.nodes.forEach(createYml)
  result.data.allArtists.nodes.forEach(createYml)
  result.data.allVaultsessions.nodes.forEach(createYml)

  // Markdown pages
  result.data.pages.group.forEach(createMdx)

  result.data.blogsByTag.group.forEach(({ fieldValue }) => {
    createPage({
      path: `/blog/tags/${fieldValue}`,
      component: layouts.tags,
      context: {
        tag: fieldValue,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.sourceInstanceName === 'media') {
    const pathComponents = node.relativeDirectory.split('/')
    const mediaDir = pathComponents[0]
    const parentDir = pathComponents.at(-1)

    createNodeField({
      name: `mediaDir`,
      node,
      value: mediaDir,
    })
    createNodeField({
      name: `parentDir`,
      node,
      value: parentDir,
    })

    // Gig media needs to know the parents parent too
    if (mediaDir === 'gig') {
      createNodeField({
        name: `gigDir`,
        node,
        value: pathComponents[1],
      })
    }
  } else if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent)
    const pathComponents = parent.relativeDirectory.split('/')
    const nodeType = pathComponents[0]

    const nodeTitle = toMachineName(node.frontmatter.title, '_')
    const nodeSlug = '/' + nodeType + '/' + nodeTitle

    const parentDir = pathComponents[1]

    createNodeField({
      name: `slug`,
      node,
      value: nodeSlug,
    })
    createNodeField({
      name: `type`,
      node,
      value: nodeType,
    })
    createNodeField({
      name: `parentDir`,
      node,
      value: parentDir,
    })
  } else if (node.internal.type.includes(`Yaml`)) {
    const parentNode = getNode(node.parent)
    const fileName = parentNode.name

    const nodeType = node.internal.type.split('Yaml')[0].toLowerCase()

    // To preserve URLs from old site
    const nodeTitle = nodeType === 'gig' ? toMachineName(node.title, '-') : toMachineName(node.title, '_')
    const slugType = nodeType + 's'

    const nodeSlug = '/' + slugType + '/' + nodeTitle

    createNodeField({
      name: `slug`,
      node,
      value: nodeSlug,
    })
    createNodeField({
      name: `type`,
      node,
      value: nodeType,
    })
    createNodeField({
      name: `fileName`,
      node,
      value: fileName,
    })

    if (nodeType === 'gig') {
      const date = new Date(node.date)
      const year = date.getFullYear()
      const month = date.getMonth()

      // So we can group and sort by these
      createNodeField({
        name: `year`,
        node,
        value: year,
      })
      createNodeField({
        name: `month`,
        node,
        value: month,
      })
      createNodeField({
        name: `yearAndMonth`,
        node,
        value: '' + year + (month < 10 ? '0' + month : month),
      })
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Audioculture {
      link: String!
      snippet: String!
      image: String
    }
    type Track {
      title: String!
      time: String!
      link: String
    }
    type GigVid {
      link: String!
      title: String
    }
    type GigArtist {
      name: String!
      vid: [GigVid]
      tracklist: [Track]
    }
    type GigYaml implements Node {
      title: String!
      venue: String!
      artists: [GigArtist!]
      description: String
      intro: String
      feature_vid: String
      audioOnly: Boolean
    }
    type ArtistYaml implements Node {
      title: String!
      description: String
      facebook: String
      bandcamp: String
      website: String
      soundcloud: String
      instagram: String
      spotify: String
      origin: String
      soundcloud: String
      audioculture: Audioculture
      died: Int
    }
    type VenueYaml implements Node {
      title: String!
      lat: Float!
      lng: Float!
      description: String
      facebook: String
      website: String
      died: Int
    }
    type VaultsessionYaml implements Node {
      title: String!
      artist: String!
      full_video: String!
      description: String!
      tracklist: [Track!]
    }
  `
  createTypes(typeDefs)
}
