import React from 'react'
import Img from 'gatsby-image'

class BackgroundImage extends React.Component {
  render() {
    return <Img style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      zIndex: 0,
      height: "100%"
    }} {...this.props}></Img>
  }
}

export default BackgroundImage
