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

const realFs = require('fs')
const gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(realFs)

exports.createPages = async ({ graphql, actions }) => {
  const result = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          group(field: fields___type) {
            fieldValue
            edges {
              node {
                fields {
                  slug
                  type
                  machine_name
                  parentDir
                }
                frontmatter {
                  title
                  template
                  artists {
                    name
                  }
                  venue
                }
              }
            }
          }
        }
        blogsByTag: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, filter: { fields: { type: { eq: "blog" } } }) {
          group(field: frontmatter___tags) {
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
    gigs: path.resolve('./src/templates/gig/gig.js'),
    blog: path.resolve('./src/templates/blog/blog.js'),
    artists: path.resolve('./src/templates/artist/artist.js'),
    venues: path.resolve('./src/templates/venue/venue.js'),
    vaultsessions: path.resolve('./src/templates/vaultsession/vaultsession.js'),
    page: path.resolve('./src/templates/page/page.js'),
    tags: path.resolve('./src/templates/tags/tags.js'),
  }

  result.data.allMarkdownRemark.group.forEach((group) => {
    console.log('Creating ' + group.edges.length + ' ' + group.fieldValue)

    group.edges.forEach(({ node }, index) => {
      const previous = index === group.edges.length - 1 ? null : group.edges[index + 1].node
      const next = index === 0 ? null : group.edges[index - 1].node

      const context = {
        slug: node.fields.slug,
        previous,
        next,
        prevSlug: previous && previous.fields.slug,
        nextSlug: next && next.fields.slug,
        machine_name: node.fields.machine_name,
        parentDir: node.fields.parentDir,
        title: node.frontmatter.title,
      }

      if (node.frontmatter.artists) context.artists = node.frontmatter.artists.map((artist) => toMachineName(artist.name))
      if (node.frontmatter.venue) context.venue = node.frontmatter.venue

      let component = layouts[node.fields.type]
      if (node.frontmatter.template) component = path.resolve(`./src/templates/${node.frontmatter.template}`)

      createPage({
        path: node.fields.slug,
        component,
        context: context,
      })
    })
  })

  // Make tag index pages for blog content
  const allowedTagPages = ['interview', 'opinion', 'news', 'events', 'documentary', 'tech']

  result.data.blogsByTag.group.forEach(({ fieldValue }) => {
    if (allowedTagPages.includes(fieldValue)) {
      createPage({
        path: `/blog/tags/${fieldValue}/`,
        component: layouts.tags,
        context: {
          tag: fieldValue,
        },
      })
    }
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // We want to add fields indicating what folder media is in so we add a parentDir field
  // and a gigDir field if it's media part of gig
  if (node.internal.type === 'File') {
    const nodeType = node.sourceInstanceName

    const mediaExts = ['.mp3', '.json', '.jpg', '.JPG']

    if (mediaExts.includes(node.ext)) {
      const parsedPath = path.parse(node.absolutePath)
      const parentDir = path.basename(parsedPath.dir)

      createNodeField({
        name: `parentDir`,
        node,
        value: parentDir,
      })

      createNodeField({
        name: `type`,
        node,
        value: nodeType,
      })

      if (nodeType === 'gigs') {
        const pathComponents = node.relativeDirectory.split('/')
        if (pathComponents.length === 2) {
          const gigDir = pathComponents[0]
          createNodeField({
            name: `gigDir`,
            node,
            value: gigDir,
          })
        }
      }
    }
  }
  // For the actual gig posts we need to add some fields
  else if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent)
    const nodeType = parent.sourceInstanceName
    const nodeTitle = nodeType === 'gigs' ? toMachineName(node.frontmatter.title, '-') : toMachineName(node.frontmatter.title, '_') // to preserve URLs from old site
    const nodeSlug = '/' + nodeType + '/' + nodeTitle

    const parsedPath = path.parse(node.fileAbsolutePath)
    const parentDir = path.basename(parsedPath.dir)

    const date = new Date(node.frontmatter.date)
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

    createNodeField({
      name: `machine_name`,
      node,
      value: toMachineName(node.frontmatter.title, '_'),
    })
    createNodeField({
      name: `parentDir`,
      node,
      value: parentDir,
    })
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
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // If production JavaScript and CSS build
  if (stage === 'build-javascript') {
    // Turn off source maps
    actions.setWebpackConfig({
      devtool: false,
    })
  } else if (stage === 'build-html') {
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
          },
        ],
      },
    })
  }
}
