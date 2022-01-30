import styled from '@emotion/styled'

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .alive-icon {
    color: #31a24c;
  }

  .dead-icon {
    color: white;
    font-size: 2.5em;
  }

  .leaflet-marker-icon {
    width: 23px !important;
    height: 23px !important;
    filter: drop-shadow(1px 1px 2px black);
    svg {
      width: 100%;
      height: 100%;
    }
  }

  .leaflet-popup-content {
    max-width: 230px;
  }
`
