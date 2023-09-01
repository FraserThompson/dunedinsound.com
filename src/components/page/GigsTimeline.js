import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import Search from '../Search'
import { postFilter, scrollTo } from '../../utils/helper'
import GigTile from '../GigTile'
import Gumshoe from 'gumshoejs/src/js/gumshoe/gumshoe'
import InfiniteScroll from 'react-infinite-scroller'
import Divider from '../Divider'
import LoadingSpinner from '../LoadingSpinner'
import { GigsSidebar } from './GigsSidebar'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const GigsTimeline = React.memo(({ data }) => {
  const allPosts = useMemo(() => data.gigsByDate.group.slice().reverse(), []) //because for some reason it returns it ascending order

  // Turn the posts sorted by years into two things:
  //    - A list of years and unique months for each year
  //    - A list of posts wrapped by year and month
  //    - A dict of yera and month by slug
  // Do this in one reduce for performance (albeit slightly worse readability)
  const sortPosts = useCallback((posts) => {
    return posts.reduce(
      (obj, group, index) => {
        const previousYear = index - 1 >= 0 && posts[index - 1].fieldValue.substring(0, 4)
        const previousMonth = index - 1 >= 0 && posts[index - 1].fieldValue.substring(4)

        const year = group.fieldValue.substring(0, 4)
        const month = group.fieldValue.substring(4)

        const monthName = monthNames[parseInt(month)]

        // Add year and month for each item by slug to postsBySlug.
        // This is solely so we can go back from a gig page and scroll to the right place.
        group.nodes.forEach((node) => (obj.postsBySlug[node.fields.slug] = { year: year, month: month }))

        if (year != previousYear) {
          obj.menuItems.push({ year: year, count: group.nodes.length, months: [monthName] })
          obj.posts.push({ year: year, months: [{ month: monthName, posts: group.nodes }] })
        } else {
          obj.menuItems[obj.menuItems.length - 1].months.push(monthName)
          obj.menuItems[obj.menuItems.length - 1].count = obj.menuItems[obj.menuItems.length - 1].count + group.nodes.length
          if (month != previousMonth) {
            obj.posts[obj.posts.length - 1].months.push({ month: monthName, posts: group.nodes })
          } else {
            obj.posts[obj.posts.length - 1].months[obj.posts[obj.posts.length - 1].months.length - 1].posts.push(group.nodes)
          }
        }

        return obj
      },
      { menuItems: [], posts: [], postsBySlug: {} }
    )
  }, [])

  const { menuItems: allMenuItems, posts: allPostsSorted, postsBySlug: postsBySlug } = useMemo(() => sortPosts(allPosts), []) //sort all of them and cache it

  const [displayedMenuItems, setDisplayedMenuItems] = useState(allMenuItems)
  const [postsSorted, setPostsSorted] = useState(allPostsSorted)
  const [pageUpTo, setPageUpTo] = useState(1)
  const [scrollToAnchor, setScrollToAnchor] = useState(null)
  const [gumshoe, setGumshoe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If we came from a previous gig then load up and scroll to it
    if (typeof window !== `undefined` && window.previousPath) {
      const previousGigSlug = new URL(window.previousPath).pathname
      if (previousGigSlug) {
        setLoading(true)
        // Need to remove trailing slash
        const transformedGigSlug = previousGigSlug.slice(0, -1)
        const gigDateData = postsBySlug[transformedGigSlug]
        if (gigDateData) menuItemClick(transformedGigSlug, parseInt(gigDateData['year']))
      }
    }
    setGumshoe(
      new Gumshoe('#sidebarNav a', {
        offset: 120,
        nested: true,
        nestedClass: 'active-parent',
      })
    )
  }, [])

  useEffect(() => {
    return () => gumshoe && gumshoe.destroy()
  }, [gumshoe])

  useEffect(() => {
    scrollTo(null, scrollToAnchor, 85)
    setLoading(false)
  }, [scrollToAnchor])

  useEffect(() => {
    if (typeof window !== `undefined`) window.scrollTo(0, 0)
    setLoading(false)
  }, [postsSorted])

  useEffect(() => {
    if (gumshoe && postsSorted.length > 0) {
      gumshoe.setup()
      gumshoe.detect()
    }
  }, [postsSorted, pageUpTo])

  const filter = useCallback((searchInput) => {
    if (!searchInput || searchInput.length == 0) {
      setPostsSorted(allPostsSorted)
      setDisplayedMenuItems(allMenuItems)
      setPageUpTo(1)
    } else {
      const filteredPosts = postFilter(searchInput, allPosts)
      const { menuItems, posts } = sortPosts(filteredPosts)
      setPostsSorted(posts)
      setDisplayedMenuItems(menuItems)
      setPageUpTo(1)
    }
  }, [])

  const menuItemClick = useCallback(
    (anchor, yearIndex) => {
      setPageUpTo(yearIndex + 1 > pageUpTo ? yearIndex + 1 : pageUpTo)
      setScrollToAnchor(anchor)
    },
    [pageUpTo]
  )

  const loadMore = useCallback((index) => setPageUpTo(index + 1), [])

  return (
    <ContentWrapper>
      <GigsSidebar menuItems={displayedMenuItems} menuItemClick={menuItemClick} />
      <SearchWrapper>
        <Search placeholder="Search gigs by title, artist, or venue..." filter={filter} />
      </SearchWrapper>
      <TimelineWrapper>
        {loading && (
          <LoadingWrapper>
            <LoadingSpinner />
          </LoadingWrapper>
        )}
        <InfiniteScroll
          className="infinite-scroll"
          pageStart={0}
          loadMore={loadMore}
          hasMore={pageUpTo < allPostsSorted.length}
          loader={
            <div key={0} style={{ width: '100%', height: '20vh', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
              <LoadingSpinner />
            </div>
          }
        >
          {postsSorted.map(
            ({ year, months }, index) =>
              index < pageUpTo && (
                <section key={year} id={year}>
                  <Divider>
                    <strong>{year}</strong>
                  </Divider>
                  {months.map(({ month, posts }) => {
                    const id = `${year}-${month}`
                    return (
                      <section data-yearindex={index} key={id} id={id}>
                        {posts.map((node) => (
                          <GigTile id={node.fields.slug} key={node.fields.slug} height="40vh" node={node} />
                        ))}
                      </section>
                    )
                  })}
                </section>
              )
          )}
        </InfiniteScroll>
      </TimelineWrapper>
    </ContentWrapper>
  )
})

const ContentWrapper = styled.div``

const TimelineWrapper = styled.div`
  padding-left: 0px;

  .infinite-scroll {
    margin-top: ${(props) => `calc(${props.theme.subheaderHeight})`};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    .infinite-scroll {
      margin-top: ${(props) => `calc(${props.theme.headerHeight} + ${props.theme.subheaderHeight})`};
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding-left: 300px;
  }
`

const SearchWrapper = styled.div`
  position: sticky;
  z-index: 15;
  top: 3px;
  margin: 0;
  width: calc(100% - 45px);
  margin-left: 45px;

  @media screen and (min-width: ${(props) => props.theme.breakpoints.md}) {
    position: fixed;
    margin-left: 0px;
    top: 6px;
    z-index: 12;
    left: 300px;
    width: 40vw;
  }
`

const LoadingWrapper = styled.div`
  width: 100vw;
  min-height: ${(props) => `calc(100vh - ${props.theme.headerHeight} - 1px)`};
  position: fixed;
  top: ${(props) => `calc(${props.theme.headerHeight})`};
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`
