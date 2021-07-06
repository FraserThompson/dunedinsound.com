// Tile.js
// A cool tile.
// Props
//  - href: Path to link to
//  - label
//  - title
//  - subtitle
//  - image
//  - children (optional)
//  - width (optional): Width of the tile
//  - hoverHeight (optional): Height on hover
//  - backgroundColor (optional)
//  - height (optional): Defaults to 500px
//  - shadowBottom(optional) : Whether to show a shadow on the bottom
//    By default it assumes all images are displayed at 100vw. Check the gridToSizes method
//    in utility.js and use it to turn an array of grid sizes into something this can use.

import React from 'react'
import styled from '@emotion/styled'
import BackgroundImage from './BackgroundImage'
import Content from './Content'
import { rhythm } from '../utils/typography'
import { lighten } from 'polished'
import { Link } from 'gatsby'

export default ({
  height = '40vh',
  feature = false,
  backgroundColor = 'radial-gradient(circle, black 0%, rgba(12, 24, 33, 1) 70%)',
  width = null,
  hoverHeight = null,
  machineName = null,
  label = null,
  image = null,
  subtitle = null,
  title = null,
  children,
  href = null,
  to = null,
  id = null,
  lastGig = null,
}) => {
  const tileContent = (
    <>
      {image && <BackgroundImage image={image} />}
      <TitleWrapper shadowBottom={title || subtitle} feature={feature}>
        <Content>
          {title && <h2 className="title">{title}</h2>}
          {label && <h4>{label}</h4>}
          {subtitle && <p className="subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />}
        </Content>
        <TextContent>
          <div>{children}</div>
        </TextContent>
      </TitleWrapper>
    </>
  )

  return (
    <Container
      backgroundColor={backgroundColor}
      containerHeight={height}
      data-title={title}
      data-machinename={machineName}
      data-lastgig={lastGig || 0}
      containerWidth={width}
      hoverHeight={hoverHeight}
      className="tile"
      id={id}
    >
      {to && (
        <Link to={to} title={title} state={{ from: typeof window !== `undefined` && window.location.pathname }}>
          {tileContent}
        </Link>
      )}
      {href && (
        <a href={href} target="_blank" title={title}>
          {tileContent}
        </a>
      )}
    </Container>
  )
}

const Container = styled.div`
  background: ${(props) => props.theme.backgroundColor};
  background: ${(props) => props.backgroundColor};
  color: ${(props) => props.theme.textColor};
  position: relative;
  display: block;
  height: ${(props) => props.containerHeight};
  width: ${(props) => props.containerWidth};
  overflow: hidden;
  transition: height 100ms ease-in-out;

  &:hover {
    height: ${(props) => props.hoverHeight};
  }

  h1,
  h2,
  h3,
  h4 {
    text-shadow: 1px 1px #000;
    transition: color 0.3s ease-in-out;
  }

  a {
    &:hover,
    &:focus {
      .title {
        color: ${(props) => lighten(0.5, props.theme.textColor)};
      }
      color: ${(props) => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }

    &.active {
      background-color: ${(props) => props.theme.foregroundColor2};
      color: ${(props) => lighten(0.5, props.theme.textColor)};
    }
  }
`

const TextContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    max-width: ${(props) => props.theme.contentContainerWidth};
  }
`

const Label = styled.span`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  z-index: 5;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  right: 0px;
  top: 0px;
  small {
    color: ${(props) => props.theme.textColor};
  }
`

const TitleWrapper = styled.div`
  z-index: 5;
  width: 100%;
  position: absolute;
  bottom: 0px;
  background: ${(props) => props.shadowBottom && 'radial-gradient(circle at center, rgba(0,0,0,0), rgba(0,0,0,0.4) 60%)'};
  height: 100%;
  display: flex;
  mix-blend-mode: ${(props) => props.feature && 'difference'};

  ${Content} {
    margin-left: 0;
    display: flex;
    flex-direction: column;

    .title {
      margin-left: 0;
      margin-bottom: ${rhythm(0.5)};
      color: #ccc;
      font-size: ${(props) => (props.feature ? rhythm(2) : '1.2em')};
    }

    .subtitle {
      margin: 0px;
      margin-top: auto;
      line-height: 0.9;
    }

    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      .title {
        font-size: ${(props) => props.feature && rhythm(4)};
      }
    }
  }
`
