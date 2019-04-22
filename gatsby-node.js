// This is duplicated from helper.js because we can't do ES6 imports in gatsby-node.js but we want to do them everywhere else
const toMachineName = (string, space_character) => {
  space_character = space_character || "_";
  return string.toLowerCase().replace(/[!,.':?]/g,'').replace(/\s/g, space_character).replace(/[$]/g, 'z');
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
              date
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

      const layouts = {
        gigs: path.resolve('./src/templates/gig.js'),
        blog: path.resolve('./src/templates/blog.js'),
        artists: path.resolve('./src/templates/artist.js'),
        venues: path.resolve('./src/templates/venue.js'),
        page: path.resolve('./src/templates/page.js')
      }

      // We split it like this (pretty inefficiently) so we can treat them as seperate collections for the next/prev
      const gigs = result.data.allMarkdownRemark.edges.filter(({node}) => node.fields.type === "gigs")
      const blogs = result.data.allMarkdownRemark.edges.filter(({node}) => node.fields.type === "blog")
      const venues = result.data.allMarkdownRemark.edges.filter(({node}) => node.fields.type === "venues")
      const artists = result.data.allMarkdownRemark.edges.filter(({node}) => node.fields.type === "artists")
      const pages = result.data.allMarkdownRemark.edges.filter(({node}) => node.fields.type === "page")

      const createPages = (post, index, posts) => {

        const previous = index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node

        const context = {
          slug: post.node.fields.slug,
          previous,
          next,
          prevSlug: previous && previous.fields.slug,
          nextSlug: next && next.fields.slug,
          machine_name: post.node.fields.machine_name,
          parentDir: post.node.fields.parentDir,
          title: post.node.frontmatter.title
        }

        if (post.node.frontmatter.artists) context.artists = post.node.frontmatter.artists.map(artist => toMachineName(artist.name))
        if (post.node.frontmatter.venue) context.venue = post.node.frontmatter.venue

        createPage({
          path: post.node.fields.slug,
          component: layouts[post.node.fields.type],
          context: context,
        })

      }

      // Create pages.
      gigs.forEach((post, index) => createPages(post, index, gigs))
      blogs.forEach((post, index) => createPages(post, index, blogs))
      venues.forEach((post, index) => createPages(post, index, venues))
      artists.forEach((post, index) => createPages(post, index, artists))
      pages.forEach((post, index) => createPages(post, index, pages))
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
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

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  // If production JavaScript and CSS build
  if (stage === 'build-javascript') {
    // Turn off source maps
    actions.setWebpackConfig({
      devtool: false,
    })
  }
};
