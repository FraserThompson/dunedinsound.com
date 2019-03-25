const helper = require('./src/utils/helper.js')
const path = require('path')

// Takes the slug and returns the node type
getNodeType = (path) => {
  if (/\/gigs/.test(path)) return "gigs";
  if (/\/blog/.test(path)) return "blog";
  if (/\/venues/.test(path)) return "venues";
  if (/\/artists/.test(path)) return "artists";
}

exports.createPages = ({ graphql, actions }) => {

  return graphql(
    `
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            fileAbsolutePath
            fields {
              slug
              type
              machine_name
            }
            frontmatter {
              title
              artists { name }
              venue
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
      const gigLayout = path.resolve('./src/templates/gig.js')
      const blogLayout = path.resolve('./src/templates/blog.js')
      const artistLayout = path.resolve('./src/templates/artist.js')
      const venueLayout = path.resolve('./src/templates/venue.js')

      // Create gig pages.
      const posts = result.data.allMarkdownRemark.edges

      posts.forEach((post, index) => {

        const previous = index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node

        const context = {
          slug: post.node.fields.slug,
          previous,
          next
        }

        const nodeType = post.node.fields.type

        let layout = blogLayout;

        switch (nodeType) {
          case "gigs":
            layout = gigLayout

            context.machine_name = post.node.fields.machine_name
            context.gigDir = path.dirname(post.node.fileAbsolutePath).split("/").pop()
            context.artists = post.node.frontmatter.artists.map(artist => helper.machineName(artist.name))
            context.venue = post.node.frontmatter.venue

            break;
          case "blog":
            layout = blogLayout
            break;
          case "artists":
            layout = artistLayout
            context.machine_name = post.node.fields.machine_name
            context.title = post.node.frontmatter.title
            break;
          case "venues":
            layout = venueLayout
            context.machine_name = post.node.fields.machine_name
            context.title = post.node.frontmatter.title
            break;
        }

        createPage({
          path: post.node.fields.slug,
          component: layout,
          context: context,
        })

      })
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // For media associated w gigs we want to add fields indicating where it's from
  if (node.internal.type === 'File') {
    const nodeType = getNodeType(node.absolutePath)
    if (nodeType === "gigs") {
      switch (node.ext) {
        case ".mp3":
        case ".json":
        case ".jpg":
        case ".JPG":
          const pathComponents = node.relativeDirectory.split("\\")
          if (pathComponents.length === 2) {
            const gigDir = pathComponents[0]
            const artist = pathComponents[1]
            createNodeField({
              name: `gigDir`,
              node,
              value: gigDir
            })
            createNodeField({
              name: `artist`,
              node,
              value: artist
            })
          }
          break;
      }
    }
  }
  // For the actual gig posts we need to add some fields
  else if (node.internal.type === `MarkdownRemark`) {

    const nodeType = getNodeType(node.fileAbsolutePath)
    const nodeTitle = helper.machineName(node.frontmatter.title, "-")
    const nodeSlug = "/" + nodeType + "/" + nodeTitle + "/"

    createNodeField({
      name: `machine_name`,
      node,
      value: helper.machineName(node.frontmatter.title, "_")
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

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  // If production JavaScript and CSS build
  if (stage === 'build-javascript') {
    // Turn off source maps
    actions.setWebpackConfig({
      devtool: false,
    })
  }
};
