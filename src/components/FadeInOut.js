import styled from '@emotion/styled'

export default styled.div`
  transition: opacity 200ms ease-in-out;
  opacity: ${props => {
      const transitionStyles = {
        entering: 1,
        entered: 1,
        exiting: 0,
        exited: 0,
      }
      return transitionStyles[props.state]
    }
  };
`
