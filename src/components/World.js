import React from 'react'
import styled from '@emotion/styled'

const WorldWrapper = styled.div`
  overflow: hidden;
  perspective: ${props => props.perspective || "300px"};
  transition: perspective 0.3s ease-in-out;
  width: 100%;
  height: 100vh;
  position: relative;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: ${props => typeof InstallTrigger === 'undefined' && "camFocus 2s"};

  .checkers {
    position: absolute;
    background-size: 30px 30px;
    background-position: 0 0, 50px 0, 50px -50px, 0px 50px;
    &.off {
      background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #000), color-stop(.25, transparent)), -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #050505), color-stop(.25, transparent)), -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #161616)), -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #282828));
    }
    &.on {
      background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, white), color-stop(.25, transparent)), -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, transparent), color-stop(.25, #050505)), -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, #161616), color-stop(.75, transparent)), -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, #282828), color-stop(.75, transparent));
    }
  }

  #checkersB {
    background-color: black;
    bottom: 0;
    transform-origin: center bottom;
    transform: rotateX(90deg);
    height: 600px;
    width: 100vw;
  }

  #checkersT {
    background-color: #191919;
    top: 0;
    transform-origin: center top;
    transform: rotateX(-90deg);
    height: 600px;
    width: 100vw;
  }

  #checkersL {
    background-color: #191919;
    left: 0;
    transform-origin: left center;
    transform: rotateY(90deg);
    height: 100vh;
    width: 600px;
  }

  #checkersR {
    background-color: #191919;
    right: 0;
    transform-origin: right center;
    transform: rotateY(-90deg);
    height: 100vh;
    width: 600px;
  }

  #checkersBack {
    height: 100vh;
    width: 100vw;
    background-color: darkblue;
    transform: translateZ(-600px);
  }

  h1 {
    margin: 0;
    color: yellow;
    letter-spacing: 60px;
    font-size: 16vh;
    height: 20vh;
  }

  .post {
    z-index: 4;
    transform: translateZ(-300px) translateY(200px) translateX(-200px) skewY(-12deg);
    position: absolute;
    text-align: center;
    background-color: mediumpurple;
    text-shadow: 2px 2px 0px black, -2px -2px 0px white, 4px 4px 0px black, -4px -4px 0px white, 0 0 60px purple;

    &:hover {
      filter: invert(1);
    }

    @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
      transform: translateZ(-300px) translateY(200px) skewY(-12deg);
    }
  }

  .post:nth-of-type(1) {
    width: 50vw;
    transform-origin: left center;
    transform: translateZ(-600px) rotateY(-30deg) scaleY(1.4);
    background-color: black;
  }

  .post:nth-of-type(2) {
    transform: translateZ(-250px) skewY(-6deg) scaleY(1.4);
    background-color: #fff;
    top: 50%;
    left: 50%;
    margin-left: -700px;
    margin-top: -10vh;
  }

  .post:nth-of-type(3) {
    width: 50vw;
    right: 0;
    transform-origin: right center;
    transform: rotateY(-40deg) scaleY(1.4);
    bottom: 0;
  }

  @keyframes camFocus {
    0% {
      perspective: 10px;
    }
    100% {
      perspective: 300px;
    }
  }
`

class World extends React.PureComponent {

  render() {
    return (
      <WorldWrapper perspective={this.props.perspective}>
        <div className={`checkers ${this.props.lights}`} id="checkersBack"></div>
        <div className={`checkers ${this.props.lights}`} id="checkersT"></div>
        <div className={`checkers ${this.props.lights}`} id="checkersL"></div>
        <div className={`checkers ${this.props.lights}`} id="checkersR"></div>
        <div className={`checkers ${this.props.lights}`} id="checkersB"></div>
        {this.props.children}
      </WorldWrapper>
    )
  }
}

World.defaultProps = {
  lights: "off"
}

export default World;
