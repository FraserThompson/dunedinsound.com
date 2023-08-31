import styled from '@emotion/styled'

/**
 * Was once used and I don't want to delete it in case it's annoying to find again.
 */

const FutureGigsWrapper = styled.div`
  border: 2px solid black;
  height: 350px;
  left: 0;
  position: fixed;
  top: ${(props) => props.theme.headerHeightMobile};
  width: 100%;
  background: teal;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    top: ${(props) => props.theme.headerHeight};
  }
`

const FutureGigs = styled.div`
  position: relative;
  margin: 1em;
  padding: 3px;
  max-width: ${(props) => props.theme.contentContainerWidth};
  box-shadow: inset -1px -1px #00138c, inset 1px 1px #0831d9, inset -2px -2px #001ea0, inset 2px 2px #166aee, inset -3px -3px #003bda, inset 3px 3px #0855dd;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0 0 3px;
  -webkit-font-smoothing: antialiased;
  background: #ece9d8;

  blink {
    animation: 0.5s linear infinite condemned_blink_effect;
  }

  @keyframes condemned_blink_effect {
    0% {
      visibility: hidden;
    }
    50% {
      visibility: hidden;
    }
    100% {
      visibility: visible;
    }
  }

  .title {
    color: white;
    font-family: Trebuchet MS;
    background: linear-gradient(180deg, #0997ff, #0053ee 8%, #0050ee 40%, #06f 88%, #06f 93%, #005bff 95%, #003dd7 96%, #003dd7);
    padding: 3px 5px 3px 3px;
    border-top: 1px solid #0831d9;
    border-left: 1px solid #0831d9;
    border-right: 1px solid #001ea0;
    border-top-left-radius: 8px;
    border-top-right-radius: 7px;
    font-size: 13px;
    text-shadow: 1px 1px #0f1089;
  }

  .body {
    color: black;
    padding: 8px;
    text-align: center;

    small {
      font-size: 60%;
      position: absolute;
      left: 10px;
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      margin-left: auto;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      min-height: 23px;
      min-width: 75px;
      padding: 0 12px;
      font-family: 'Pixelated MS Sans Serif', Arial;
      -webkit-font-smoothing: antialiased;
      font-size: 11px;
      box-sizing: border-box;
      border: 1px solid #003c74;
      background: linear-gradient(180deg, #fff, #ecebe5 86%, #d8d0c4);
      box-shadow: none;
      border-radius: 3px;
    }

    a:active {
      box-shadow: none;
      background: linear-gradient(180deg, #cdcac3, #e3e3db 8%, #e5e5de 94%, #f2f2f1);
    }

    a:focus {
      box-shadow: none;
      background: linear-gradient(180deg, #cdcac3, #e3e3db 8%, #e5e5de 94%, #f2f2f1);
    }
  }
`
