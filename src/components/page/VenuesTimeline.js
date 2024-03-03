import React from 'react'

export default React.memo(({ venues, covers }) => {
  return (
    <>
      {venues.map((venue) => (
        <p>
          {venue.title} {venue.date}
        </p>
      ))}
    </>
  )
})
