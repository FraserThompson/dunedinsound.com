import styled from '@emotion/styled'

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .mapboxgl-popup-content {
    background: ${(props) => props.theme.backgroundColor};
  }

  .dead-icon {
    color: white;
    font-size: 2.5em;
  }
`
