const TransitionStyles = props => `
  .popin-enter {
    opacity: 0;
    transform: scale(0.001);
  }

  .popin-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity, transform 300ms;
    transition-delay: 0ms;
  }

  .popin-exit {
    opacity: 1;
    transform: scale(1);
  }

  .popin-exit-active {
    opacity: 0;
    transform: scale(0.001);
    transition: opacity, transform 300ms;
    transition-delay: 0ms;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity 300ms;
    transition-delay: 0ms;
  }

  .fade-exit {
    display: none;
  }

  .fade-exit-active {
    display: none;
  }

`;

export default TransitionStyles
