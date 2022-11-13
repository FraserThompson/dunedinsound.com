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
import { darken, lighten } from 'polished'
import { Link } from 'gatsby'

export default ({
  height = '40vh',
  feature = false,
  backgroundColor,
  textColor,
  fontWeight,
  width,
  hoverHeight,
  machineName,
  label,
  image,
  subtitle,
  title,
  prefix,
  children,
  href,
  to,
  id,
  dataAttributes = {},
}) => {
  const tileContent = (
    <>
      {image && <BackgroundImage image={image} />}
      <TitleWrapper shadowBottom={title || subtitle} feature={feature}>
        <Content>
          {title && (
            <h2 className="title">
              {prefix && <span className="prefix">{prefix}</span>}
              {title}
            </h2>
          )}
          {label && (
            <h4 className="label">
              <strong>{label}</strong>
            </h4>
          )}
          {subtitle && <h4 className="subtitle" dangerouslySetInnerHTML={{ __html: subtitle }} />}
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
      textColor={textColor}
      fontWeight={fontWeight}
      containerHeight={height}
      data-title={title}
      data-machinename={machineName}
      containerWidth={width}
      hoverHeight={hoverHeight}
      className="tile"
      id={id}
      {...dataAttributes}
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
  font-weight: ${(props) => props.fontWeight || 'normal'};
  background: ${(props) => props.theme.backgroundColor};
  background: ${(props) => props.backgroundColor || `radial-gradient(circle, black 0%, ${props.theme.backgroundColor} 70%)`};
  color: ${(props) => props.textColor || props.theme.textColor};
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
    color: ${(props) => props.textColor || props.theme.textColor};
    &:hover,
    &:focus {
      .title {
        color: ${(props) => lighten(0.5, props.textColor || props.theme.textColor)};
      }
      color: ${(props) => lighten(0.5, props.textColor || props.theme.textColor)};
      text-decoration: none;
    }

    &.active {
      background-color: ${(props) => props.theme.foregroundColor2};
      color: ${(props) => lighten(0.5, props.textColor || props.theme.textColor)};
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

const TitleWrapper = styled.div`
  z-index: 5;
  position: absolute;
  bottom: 0px;
  background: ${(props) => props.shadowBottom && `radial-gradient(circle at center, rgba(0,0,0,0), rgba(0,0,0,0.4) 60%)`};
  height: 100%;
  width: 100%;
  display: flex;
  mix-blend-mode: ${(props) => props.feature && 'lighten'};

  ${Content} {
    width: 100%;
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
      color: ${() => darken(0.2, '#ccc')};
    }

    .prefix {
      font-weight: 200;
      color: ${() => darken(0.2, '#ccc')};
    }

    .label {
      color: ${() => darken(0.2, '#ccc')};
    }

    @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
      .title {
        font-size: ${(props) => props.feature && rhythm(2.5)};
      }
    }

    @media screen and (min-width: ${(props) => props.theme.breakpoints.lg}) {
      .title {
        font-size: ${(props) => props.feature && rhythm(4)};
      }
    }
  }
`
