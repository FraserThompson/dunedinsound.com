import styled from '@emotion/styled'
import Menu from './Menu'
import { lighten } from 'polished'

export const PlayerWrapper = styled.div`
  transition: all 150ms ease-in-out;
  border: 3px groove #585662;
  background: linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%);
`

export const AudioWrapper = styled.div`
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  margin-right: 5px;
  border: 3px groove #585662;

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
`

export const Transport = styled.div``

export const TracklistWrapper = styled(Menu)`
  overflow-y: auto;
  max-height: 90vh;
  background-color: black;
  margin: 5px;
  border: 3px groove #585662;

  li {
    line-height: 2.5rem;
  }

  .title {
    font-family: monospace;
    font-size: 18px !important;
    color: #28da1d;
  }

  .active {
    background-color: #0818c4 !important;
  }

  > li:hover:not(.active) {
    background-color: ${() => lighten(0.1, '#0818c4')};
  }

  .tracklist {
    margin-top: 0px;
    margin-bottom: 0px;
  }
`
