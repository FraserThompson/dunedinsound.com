// BackgroundImage.js
// Display one or more background images.
// Params:
//  - an image node or array of image nodes


import React from 'react'
import Img from 'gatsby-image'

class BackgroundImage extends React.PureComponent {

  render() {
    return <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%"}}>
      {Array.isArray(this.props.image) ?
        this.props.image.map(({node}, index) => <Img
          className="backgroundImage"
          key={index}
          style={{
            width: ((1 / this.props.image.length) * 100) + "%",
            zIndex: 0,
            height: "100%"
          }} fluid={node.childImageSharp.fluid}/>
        )
        :
        <Img className="backgroundImage" style={{width: "100%", zIndex: 0, height: "100%"}} fluid={this.props.image.childImageSharp.fluid}/>
      }
    </div>
  }
}

export default BackgroundImage
