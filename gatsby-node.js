const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

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
            context.gigImagesRegex = post.node.fields.slug.substring(1) + "[^cover].*\\/(.*?).jpg$/"
            context.gigAudioRegex = post.node.fields.slug.substring(1) + "[^cover].*\\/(.*?).(mp3|json)$/"
            context.gigJsonRegex = post.node.fields.slug.substring(1) + "[^cover].*\\/(.*?).(json)$/"
            context.artists = post.node.frontmatter.artists.map(artist => artist.name)
            context.venue = post.node.frontmatter.venue
            break;
          case "blog":
            layout = blogLayout
            break;
          case "artists":
            context.artistImagesRegex = "/(.*?)\\/" + post.node.fields.machine_name + "\\/(.*?).jpg$/"
            context.artistAudioRegex = "/(.*?)\\/" + post.node.fields.machine_name + "\\/(.*?).mp3$/"
            layout = artistLayout
            break;
          case "venues":
            layout = venueLayout
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

  // When creating nodes we look at the path and add a 'type' field
  if (node.internal.type === `MarkdownRemark`) {

    const value = createFilePath({ node, getNode })
    const nodeType = getNodeType(node.fileAbsolutePath)
    const nodeSlug = "/" + nodeType + value;

    createNodeField({
      name: `machine_name`,
      node,
      value: value.substring(1, value.length - 1),
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

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  // If production JavaScript and CSS build
  if (stage === 'build-javascript') {
    // Turn off source maps
    actions.setWebpackConfig({
      devtool: false,
    })
  }
};
