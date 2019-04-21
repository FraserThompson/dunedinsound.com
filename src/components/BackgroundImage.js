// BackgroundImage.js
// Display one or more background images.
// Params:
//  - fluid: A fluid image or array of fluid images.


import React from 'react'
import Img from 'gatsby-image'

class BackgroundImage extends React.PureComponent {

  render() {

    return <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%"}}>
      {Array.isArray(this.props.fluid) ?
        this.props.fluid.map((image, index) => <Img
          className="backgroundImage"
          key={index}
          style={{
            width: ((1 / this.props.fluid.length) * 100) + "%",
            zIndex: 0,
            height: "100%"
          }} fluid={image}/>
        )
        :
        <Img className="backgroundImage" style={{width: "100%", zIndex: 0, height: "100%"}} fluid={this.props.fluid}/>
      }
    </div>
  }
}

export default BackgroundImage
