const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const gigLayout = path.resolve('./src/templates/gig.js')
    const blogLayout = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create gig pages.
        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach((post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          if (/\/gigs/.test(post.node.fields.slug)) {

            const layout = gigLayout

            const gigImagesRegex = post.node.fields.slug + ".*\\/*.jpg$/"
            console.log(gigImagesRegex);
  
            createPage({
              path: post.node.fields.slug,
              component: layout,
              context: {
                slug: post.node.fields.slug,
                gigRegex: gigImagesRegex,
                previous,
                next,
              },
            })

          } else if (/\/blog-posts/.test(post.node.fields.slug)) {

            const layout = blogLayout

            createPage({
              path: post.node.fields.slug,
              component: layout,
              context: {
                slug: post.node.fields.slug,
                previous,
                next,
              },
            })

          }

        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
