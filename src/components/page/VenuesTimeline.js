import styled from '@emotion/styled'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Timeline } from 'vis-timeline/esnext'
import { DataSet } from 'vis-data/peer'
import 'vis-timeline/styles/vis-timeline-graph2d.css'
import React, { useEffect, useRef } from 'react'

export default React.memo(({ venues, covers }) => {
  const timelineContainer = useRef()

  useEffect(() => {
    const items = new DataSet(
      venues
        .filter((venue) => venue.date)
        .map((venue, i) => {
          return {
            id: i,
            start: Date.parse(venue.date),
            end: venue.died ? Date.parse(venue.died) : Date.now(),
            content: venue.title,
          }
        })
    )

    // Configuration for the Timeline
    const options = {}

    // Create a Timeline
    const timeline = new Timeline(timelineContainer.current, items, options)
  }, [])

  return <TimelineContainer ref={timelineContainer} />
})

const TimelineContainer = styled.div``
