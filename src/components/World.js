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
    letter-spacing: 2px;
    height: auto;
    text-align: center;
    text-shadow: 2px 2px 0px black, -2px -2px 0px white, 4px 4px 0px black, -4px -4px 0px white, 0 0 60px purple;
    font-size: 16vh;
  }

  article {
    z-index: 4;
    position: absolute;
    text-align: center;
    transition: transform 0.3s ease-in-out;

    h1 {
      font-size: 4em;
    }

    @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
      h1 {
        letter-spacing: 60px;
        height: 20vh;
        font-size: 16vh;
      }
    }

    &:hover {
      filter: invert(1);
    }

    &:nth-of-type(1) {
      transform-origin: left center;
      background-color: mediumpurple;
      transform: translateZ(0px) translateY(15vh) translateX(0px) skewY(-12deg);

      @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
        transform: translateZ(-300px) translateY(15vh) translateX(-20vh) skewY(-12deg);
      }

      &:hover {
        transform: translateZ(-320px) translateY(200px) translateX(-200px) skewY(-8deg);
      }
    }

    &:nth-of-type(2) {
      transform: translateZ(0px) translateY(40vh) translateX(0px) skewY(-6deg) scaleY(1.4);
      background-color: mediumaquamarine;
      font-size: 0.8em;

      @media screen and (min-width: ${props => props.theme.breakpoints.xs}) {
        transform: translateZ(-320px) translateY(60vh) translateX(20vh) skewY(-6deg) scaleY(1.4);
        font-size: 16vh;
      }

      &:hover {
        transform: translateZ(-300px) translateY(60vh) translateX(20vh) skewY(-4deg) scaleY(1.4);
      }
    }

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
