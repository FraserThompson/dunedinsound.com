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
//  - textColor (optional)
//  - height (optional): Defaults to 500px
//  - shadowBottom(optional) : Whether to show a shadow on the bottom
//  - imageSizes (optional): This is an array which helps gatsby decide what size image to show.
//    By default it assumes all images are displayed at 100vw. Check the gridToSizes method
//    in utility.js and use it to turn an array of grid sizes into something this can use.

import React from 'react'
import styled from '@emotion/styled'
import BackgroundImage from './BackgroundImage'
import Content from './Content'
import { rhythm } from '../utils/typography'
import { lighten } from 'polished'
import { Link as RouterLink } from '@reach/router'

export default ({
  height = '40vh',
  backgroundColor = 'radial-gradient(circle, rgba(236, 64, 103, 1) 0%, rgba(12, 24, 33, 1) 70%)',
  width,
  machineName,
  label,
  image,
  imageSizes,
  subtitle,
  title,
  children,
  href,
  to,
  id,
}) => {
  const tileContent = (
    <>
      {label && (
        <Label>
          <small>{label}</small>
        </Label>
      )}
      {image && <BackgroundImage sizes={imageSizes} image={image} />}
      <TitleWrapper shadowBottom={title || subtitle}>
        <Content>
          {title && <h4 className="title">{title}</h4>}
          {subtitle && (
            <p className="subtitle">
              <small>{subtitle}</small>
            </p>
          )}
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
      containerWidth={width}
      className="tile"
      id={id}
    >
      {to && (
        <RouterLink to={to} title={title} state={{ from: window.location.pathname }}>
          {tileContent}
        </RouterLink>
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
  background: ${props => props.theme.backgroundColor};
  background: ${props => props.backgroundColor};
  color: ${props => props.theme.textColor};
  position: relative;
  display: block;
  height: ${props => props.containerHeight};
  width: ${props => props.containerWidth};
  overflow: hidden;
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
      h4 {
        color: ${props => lighten(0.5, props.theme.textColor)};
      }
      color: ${props => lighten(0.5, props.theme.textColor)};
      text-decoration: none;
    }

    &.active {
      background-color: ${props => props.theme.foregroundColor2};
      color: ${props => lighten(0.5, props.theme.textColor)};
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
    max-width: ${props => props.theme.contentContainerWidth};
  }
`

const Label = styled.span`
  position: absolute;
  background-color: ${props => props.theme.contrastColor};
  z-index: 5;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  padding-left: ${rhythm(0.5)};
  padding-right: ${rhythm(0.5)};
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  left: 0px;
  top: 0px;
  small {
    color: ${lighten(0.2, 'black')};
  }
`

const TitleWrapper = styled.div`
  z-index: 5;
  width: 100%;
  position: absolute;
  bottom: 0px;
  background: ${props => props.shadowBottom && 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 40%)'};
  height: 100%;
  display: flex;

  ${Content} {
    margin-top: auto;
    margin-left: 0;

    .title {
      margin-left: 0;
      margin-bottom: ${rhythm(0.5)};
      color: white;
    }

    .subtitle {
      margin: 0px;
      line-height: 0.9;
    }
  }
`
