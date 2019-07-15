/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

// This disables the scroll updating behavior on the gigs page
// So the the lightbox back button thing on the gigs page puts you back to your previous scroll location
exports.shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (/gigs/.test(location.pathname)) {
    return false
  }
  return true
}

// So that the previous path object is always available and we cean use it to tell where we came from
exports.onRouteUpdate = () => {
  window.locations = window.locations || [document.referrer]
  locations.push(window.location.href)
  window.previousPath = locations[locations.length - 2]
}
