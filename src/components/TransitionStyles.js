const TransitionStyles = props => `
  .popin-enter, popin-appear {
    opacity: 0.01;
    transform: scale(0.001);
  }

  .popin-enter.popin-enter-active, .popin-appear.popin-appear-active {
    opacity: 1;
    transform: scale(1);
    transition: opacity, transform 400ms;
    transition-delay: 0ms;
  }

  .popin-leave {
    opacity: 1;
    transform: scale(1);
  }

  .popin-leave.popin-leave-active {
    opacity: 0.01;
    transform: scale(0.001);
    transition: opacity, transform 400ms;
    transition-delay: 0ms;
  }
`;

export default TransitionStyles
