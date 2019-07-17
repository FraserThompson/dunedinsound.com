import React from 'react'
import styled from '@emotion/styled'
import { scale } from '../../utils/typography'
import Tile from '../../components/Tile'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp } from 'react-icons/md'
import ZoopUpWrapper from '../../components/ZoopUpWrapper'

export default React.memo(({ data }) => (
  <>
    <ZoopUpWrapper title="BACK TO GIGS ☝" href="/gigs/">
      <p>☝ BACK TO GIGS ☝</p>
      <MdKeyboardArrowUp />
    </ZoopUpWrapper>
    {data.prevPost && (
      <NextPrevWrapper className="hideMobile" prev>
        <div className="icon">
          <MdKeyboardArrowRight />
        </div>
        <Tile
          key={data.prevPost.fields.slug}
          title={data.prevPost.frontmatter.title}
          image={data.prevPost.frontmatter.cover}
          label={data.prevPost.frontmatter.date}
          height="100%"
          imageSizes={{ xs: '1', sm: '4', lg: '4' }}
          to={data.prevPost.fields.slug}
        />
      </NextPrevWrapper>
    )}
    {data.nextPost && (
      <NextPrevWrapper className="hideMobile" next>
        <div className="icon">
          <MdKeyboardArrowLeft />
        </div>
        <Tile
          key={data.nextPost.fields.slug}
          title={data.nextPost.frontmatter.title}
          image={data.nextPost.frontmatter.cover}
          label={data.nextPost.frontmatter.date}
          height="100%"
          imageSizes={{ xs: '1', sm: '4', lg: '4' }}
          to={data.nextPost.fields.slug}
        />
      </NextPrevWrapper>
    )}
  </>
))

const NextPrevWrapper = styled.div`
  color: ${props => props.theme.textColor};
  position: absolute;
  right: ${props => (props.prev ? '-10vw' : null)};
  left: ${props => (props.next ? '-10vw' : null)};
  z-index: 5;
  height: 100%;
  top: 0px;
  width: 20vw;
  opacity: 0.5;
  transition: all 300ms ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    ${scale(4)};
    position: absolute;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    right: ${props => (props.prev ? '10vw' : null)};
    left: ${props => (props.next ? '10vw' : null)};
    height: 100%;
  }
  .tile {
    position: absolute;
    width: 100%;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
  &:hover {
    right: ${props => (props.prev ? '0px' : null)};
    left: ${props => (props.next ? '0px' : null)};
    box-shadow: ${props => (props.prev ? '-6px 0px 12px rgba(0,0,0,.5)' : '6px 0px 12px rgba(0,0,0,.5)')};
    opacity: 1;
    .tile {
      opacity: 1;
    }
  }
`
