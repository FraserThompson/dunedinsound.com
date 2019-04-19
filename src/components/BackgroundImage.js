import React from 'react'
import Img from 'gatsby-image'


class BackgroundImage extends React.Component {

  render() {

    let background = "";
    if (Array.isArray(this.props.fluid)) {
      background = this.props.fluid.map((image, index) => <Img
        className="backgroundImage"
        key={index}
        style={{
          width: ((1 / this.props.fluid.length) * 100) + "%",
          zIndex: 0,
          height: "100%"
        }} fluid={image}/>
      )
    } else {
      background = <Img
        className="backgroundImage"
        style={{
          width: "100%",
          zIndex: 0,
          height: "100%"
        }} fluid={this.props.fluid}
      />
    }

  return <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', width: "100%", height: "100%"}}>
      {background}
    </div>
  }
}

export default BackgroundImage
