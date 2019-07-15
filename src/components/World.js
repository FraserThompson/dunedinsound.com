import React from 'react'
import styled from '@emotion/styled'

const WorldWrapper = styled.div`
  overflow: hidden;
  perspective: ${props => props.perspective || '300px'};
  transition: all 0.3s ease-in-out;
  width: 100%;
  height: calc(100vh - ${props => props.theme.headerHeight});
  position: relative;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: ${props => typeof InstallTrigger === 'undefined' && 'camFocus 2s'};

  .checkers {
    position: absolute;
    background-size: 30px 30px;
    background-position: 0 0, 50px 0, 50px -50px, 0px 50px;
    &.off {
      background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, #000), color-stop(0.25, transparent)),
        -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, #050505), color-stop(0.25, transparent)),
        -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.75, transparent), color-stop(0.75, #161616)),
        -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.75, transparent), color-stop(0.75, #282828));
    }
    &.on {
      background-image: -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, white), color-stop(0.25, transparent)),
        -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.25, transparent), color-stop(0.25, #050505)),
        -webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.75, #161616), color-stop(0.75, transparent)),
        -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.75, #282828), color-stop(0.75, transparent));
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

  h2 {
    margin: 0;
    color: cyan;
    letter-spacing: 2px;
    height: auto;
    text-align: center;
    text-shadow: 2px 2px 0px black, -2px -2px 0px white, 4px 4px 0px black, -4px -4px 0px white, 0 0 60px purple;
    font-size: 12vh;
  }

  .posts {
    transform: translateZ(-600px);
    article {
      transition: all 0.3s ease-in-out;
      background-color: rgba(0, 0, 0, 0.8);
      border: 10px dotted yellow;
      &:hover {
        filter: invert(1);
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
  lights: 'off',
}

export default World
