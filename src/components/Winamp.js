import styled from '@emotion/styled'
import Menu from './Menu'
import { lighten } from 'polished'

export const PlayerWrapper = styled.div`
  transition: all 150ms ease-in-out;
  border: ${(props) => !props.barebones && '3px groove #585662'};
  background: linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%);
`

export const AudioWrapper = styled.div`
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => !props.barebones && '3px groove #585662'};

  region.wavesurfer-region {
    cursor: pointer !important;
    width: 2px !important;
    z-index: 4 !important;
    background-color: rgba(255, 255, 255, 0.5) !important;
  }

  region.wavesurfer-region:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    z-index: 5 !important;
  }

  region.wavesurfer-region:hover::after {
    background-color: rgba(255, 255, 255, 1);
    z-index: 5 !important;
    max-width: 1000px;
  }

  region.wavesurfer-region::after {
    content: attr(data-id);
    z-index: 4 !important;
    -webkit-transition: background-color 100ms ease-in-out;
    -moz-transition: background-color 100ms ease-in-out;
    transition: background-color 100ms ease-in-out;
    position: absolute;
    bottom: 0;
    color: black;
    background-color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 85%;
  }

  #prev {
    display: none;
  }

  #next {
    display: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    #prev {
      display: initial;
    }

    #next {
      display: initial;
    }
  }
`

export const Titlebar = styled.div`
  text-align: left;
  background-color: #e7d1ab;
  color: #cccfd6;
  font-size: 12px;
  font-family: monospace;
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 10px;
  border-radius: 2px;
  &::before {
    background: -webkit-linear-gradient(top, #fffcdf 0%, #fffcdf 29%, #736c50 32%, #736c50 66%, #d5ceb1 69%, #d5ceb1 100%);
    content: '';
    height: 8px;
    width: 100%;
    margin-top: 1px;
    position: absolute;
    z-index: 0;
  }
  &::after {
    content: 'AUDIO PLAYER';
    position: absolute;
    margin-top: -5px;
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    z-index: 1;
    left: 50%;
    transform: translate(-50%);
    background-color: #353551;
  }
`

export const TransportButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  padding: 10px;
  color: #bfced9;
  svg {
    width: 80%;
    height: 80%auto;
  }
  &.buttonStyle {
    background-size: cover;
    background-repeat: no-repeat;
    width: 23px;
    height: 18px;
    margin-top: 3px;

    &:hover:enabled {
      filter: brightness(0.8);
    }

    &:disabled {
      filter: opacity(0.2);
    }

    &.left {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAR9JREFUOE9jXLflyH8GKoNb9+8zLJg2nYERZLirtzXVjN+99SjDqvXrGC4cPYEw/Ny5axRb8Pb5ewaQq08cP85w8/zFATK8v3cq3CeFxdkYvoLJI8uBXH7+/DmGy9dvMNw4dwG3y0GavX18GSIiPRjQgwyXHLLheIMFlwEwcZBX0C2myHBkgwkZfuvCJeKDBd1gQoaTFCxGRloMK5bvQIlYfMFCkstBpqJbQFXD0S2guuHIFpBtOCgIYABb0QCTR5ZDToooYQ4qcKgBYDkUbjjIUFCB8/XDe2qYD87+ty5cZmDsmLz4/4UL5xl+fP9BFYNhhoANV1Ex+c/IwIgwmBHCZmJkYADVImAeIyMDI1QcopARLMbwH6ICWQ7ChpgBALmEbxNdP+hCAAAAAElFTkSuQmCC');
    }
    &.right {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAPpJREFUOE9jXLflyH8GKoNb9+8zqCkqMjCCDHf1tqaa8bu3HmVYtX4dQ1hgEMLwc+euUWzB2+fvGUCuPnH8OENcVNQAGd7fOxXsk8LibAwfweTQ5UEuP3/+HMPl6zfwuxxkgLePL8PWLZsxLIDJRUR6MCAHJ8mGg1yHbgFVDUe3gOqGI1tAE8NhYUx1w5Ejj6qGo6cKqhmObjAo7Ck23MhIC5x5sBULMDl0eZzpHFTgUANg5FCQoaAC5+uH99QwH5z9Xz98z8DYMXnx/wsXzjP8+P6DKgbDDDm4fS0Do6VlKLiyYGRkYvj//z8DIyMjDkuwi+NSfu3afgYAwOpci2zN3WMAAAAASUVORK5CYII=');
    }
    &.play {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAQ9JREFUOE/FlbESwUAQhnfzLswo6YxOoTBDyzsoeQQlHaWSjoKhVJ4uoRGqoFFKR3dmw0oGiRM345rM3F2+/78/uxccToUEzcN2HBh0e4AEzxez2vDz2QL6oyFshOXDTcv+WcA9ukCuhRBwWG3+BG+3ut5J6o2a8onIuWmZYK1t2C0jnBO8VC7DZDxWFgnCI2NhONtWEfna+XMmUSKxnauIaINXKwVPL1jCQfh+tQ0vxefM2fk7KK/Fdh4FfQ9XcK4C/RqeSadeMv3UTaGZ04WjY3CHPj4oQenCObsnHXyv/Q9ULc1OX5La5XzRAmaI5zyZyEkABDTQhyMC8i8Eb/PIT+B9/n7j/q6ktfs0SgOutQw52vzOQLoAAAAASUVORK5CYII=');
    }
    &.pause {
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAPZJREFUOE9jXLv12H8GKoPr9+8zrJmzjIERZLiTlyXVjN+37TjD0nVrGe6duYkw/Nz56xRb8OH5BwaQq48dO8bw/PqjATC8t2cqii+KS7LhfHxyIJefO3+O4fy16wzPrj7E7nKQAb5+fmADI8LdGJCDDJ8csuE4g2VkGz4a5vBkSr/UcgNHDjUy1ETJRMjpHJ8cTpeDChxqAFgOfX79MSSHggwFFTjfP7ynhvng7A/OoS1Tlv4H2fbj+w+qGAwz5AXI5To6rv8ZGBgZGBkZEYYzMjIwwqoQEJuRkeH///9gGgRh4D8jAwMjiGBgYGBkQoiD1IC0AwDEdnVTCfcsTgAAAABJRU5ErkJggg==');
    }
  }
`

export const ToggleButton = styled.a`
  font-family: monospace;
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;

  &:active,
  &:hover,
  &.active {
    text-shadow: 0px 0px 6px #00ff0f;
    color: #20ff17;
  }
`

export const Transport = styled.div`
  margin-left: 8px;
  margin-right: 8px;
`

export const TracklistWrapper = styled(Menu)`
  overflow-y: auto;
  max-height: 90vh;
  background-color: black;
  margin: 5px;
  border: 3px groove #585662;

  ul {
    padding-left: 5px;
  }

  li {
    line-height: 1.5rem;
  }

  .title {
    font-family: monospace;
    font-size: 18px !important;
    color: #28da1d;
  }

  .active {
    background-color: #0818c4 !important;
  }

  > li:hover:not(.active):not(.noHover) {
    background-color: ${() => lighten(0.1, '#0818c4')};
  }

  li.noHover {
    cursor: initial;
  }
  li.noHover:hover {
    color: #28da1d !important;
  }

  .tracklist {
    margin-top: 0px;
    margin-bottom: 0px;
  }
`
