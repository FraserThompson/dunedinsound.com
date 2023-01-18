import React from 'react'
import styled from '@emotion/styled'
import { scale } from '../../utils/typography'
import Tile from '../../components/Tile'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import BackButton from '../../components/BackButton'
import ShareButton from '../../components/ShareButton'

export default React.memo(({ thisPost, nextPost, prevPost }) => (
  <BannerOverlayWrapper>
    <BackButton
      to={typeof window !== `undefined` && window.history.state && window.history.state.from ? window.history.state.from : undefined}
      title="Back to Gigs"
      gigSlug={thisPost.fields.slug}
      gigYear={thisPost.date.split(' ')[2]}
      type="up"
    />
    {prevPost && (
      <NextPrevWrapper className="hideMobile" prev>
        <div className="icon">
          <FaChevronRight />
        </div>
        <Tile
          key={prevPost.fields.slug}
          title={prevPost.title}
          coverDir={prevPost.fields.fileName}
          label={prevPost.date}
          height="100%"
          to={prevPost.fields.slug}
        />
      </NextPrevWrapper>
    )}
    {nextPost ? (
      <NextPrevWrapper className="hideMobile" next>
        <div className="icon">
          <FaChevronLeft />
        </div>
        <Tile
          key={nextPost.fields.slug}
          title={nextPost.title}
          coverDir={nextPost.fields.fileName}
          label={nextPost.date}
          height="100%"
          to={nextPost.fields.slug}
        />
      </NextPrevWrapper>
    ) : (
      <Label>LATEST GIG</Label>
    )}
    <ShareButton
      shareData={{
        title: 'GIG MEDIA: ' + thisPost.title,
        url: 'https://dunedinsound.com' + thisPost.fields.slug,
        description: `Photos, audio and video from ${thisPost.title}.`,
      }}
    />
  </BannerOverlayWrapper>
))

const BannerOverlayWrapper = styled.div``

const Label = styled.div`
  position: absolute;
  font-weight: bold;
  left: -60px;
  background-color: white;
  color: black;
  top: 20px;
  width: 200px;
  text-align: center;
  transform: rotateZ(-40deg);
  font-size: 60%;
  @media screen and (min-width: ${(props) => props.theme.breakpoints.xs}) {
    left: -50px;
    top: 25px;
    font-size: 100%;
  }
`

const NextPrevWrapper = styled.div`
  color: ${(props) => props.theme.textColor};
  position: absolute;
  right: ${(props) => (props.prev ? '-10vw' : null)};
  left: ${(props) => (props.next ? '-10vw' : null)};
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
    ${scale(2)};
    position: absolute;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    right: ${(props) => (props.prev ? '10vw' : null)};
    left: ${(props) => (props.next ? '10vw' : null)};
    height: 100%;
  }
  .tile {
    position: absolute;
    width: 100%;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
  &:hover {
    right: ${(props) => (props.prev ? '0px' : null)};
    left: ${(props) => (props.next ? '0px' : null)};
    box-shadow: ${(props) => (props.prev ? '-6px 0px 12px rgba(0,0,0,.5)' : '6px 0px 12px rgba(0,0,0,.5)')};
    opacity: 1;
    .tile {
      opacity: 1;
    }
  }
`
