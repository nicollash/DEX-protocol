import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useParams, useHistory } from 'react-router-dom'

import HeaderCard from 'views/Explore/components/HeaderCard'
import ExploreTable from 'views/Explore/components/ExploreTable'

import Label from 'components/Label'
import Spacer, { SpacerResponsive } from 'components/Spacer'
import SearchBar from 'components/SearchBar'
import { Row, RowBetween, RowFixed } from 'components/Row'
import Input from 'components/Input'

import { EXPLORER_FILTER } from 'monox/constants'
import ExploreImg from 'assets/img/explore.png'
import searchIcon from 'assets/img/search.svg'

const Explore = () => {
  const history = useHistory()
  const param = useParams()
  // const { collections } = usePrismic()
  const [focus, setFocus] = useState(false)
  const [filter, setFilter] = useState()
  const [filterTxt, setFilterTxt] = useState('')
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()

  useEffect(() => {
    if (param.filter && EXPLORER_FILTER[param.filter]) {
      setFilter(param.filter)
    } else {
      setFilter()
      history.push(`/explore?network=${networkName}`)
    }
  }, [param.filter])

  return (
    <HelmetProvider>
      <Helmet>
        <title>Explore Tokens | MonoX</title>
      </Helmet>
      {filter ? (
        <Container style={{ flexDirection: 'column' }}>
          <img
            src={ExploreImg}
            alt="explore image"
            style={{ width: '100%', height: '360px', marginTop: '-70px' }}
          />
          <InnerContainer>
            <Label
              text={EXPLORER_FILTER[param.filter]?.name}
              size="42"
              weight="800"
              color="#ffffff"
            />
            <Label
              text={EXPLORER_FILTER[param.filter]?.short_description?.[0]?.text}
              size="18"
              weight="800"
              color="#ffffff"
              style={{ marginTop: '8px' }}
            />
          </InnerContainer>
          <img
            src={EXPLORER_FILTER[param.filter]?.image?.url}
            alt="explore image"
            height="110"
            style={{ marginTop: '-55px' }}
          />
          <Spacer size="lg" />
        </Container>
      ) : null}
      <Explorepage>
        {filter ? (
          <RowHeader style={{ marginBottom: '25px' }}>
            <RowFixed>
              <Label
                text={EXPLORER_FILTER[param.filter]?.tableHeading}
                size="21"
                weight="800"
              />
            </RowFixed>
            <SearchContainer focus={focus}>
              <Input
                style={{
                  opacity: '0.5',
                  fontSize: '13px',
                  fontWeight: '800',
                  marginLeft: '30px',
                }}
                placeholder={`Filter Tokens`}
                value={filterTxt}
                onChange={(evt) => setFilterTxt(evt.target.value)}
              />
              <SearchIcon src={searchIcon} />
            </SearchContainer>
          </RowHeader>
        ) : (
          <>
            <Spacer size="lg" />
            <Label
              size="42"
              weight="800"
              align="center"
              text="Explore Tokens"
            />
            <Spacer size="md" />
            <RowInput>
              <SearchBar />
            </RowInput>
            <HeaderCard
              filter={filter}
              setFilter={setFilter}
              collections={EXPLORER_FILTER} //{collections}
              clickable
            />
            <SpacerResponsive />
            <RowBetween>
              <Label
                text="Featured Tokens"
                weight="800"
                size="24"
                align="left"
                style={{ marginLeft: '15px' }}
              />
            </RowBetween>
            <Spacer />
          </>
        )}
        <ExploreTable name={param.filter} filterTxt={filterTxt} />
        {filter ? (
          <>
            <div style={{ width: '100%', textAlign: 'left' }}>
              <Label
                text="More Categories"
                weight="800"
                size="24"
                style={{ marginBottom: '40px', marginTop: '100px' }}
              />
              <HeaderCard
                filter={filter}
                setFilter={setFilter}
                collections={EXPLORER_FILTER} //{collections}
                clickable
              />
            </div>
          </>
        ) : null}
      </Explorepage>
    </HelmetProvider>
  )
}

const Explorepage = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  max-width: 1068px;
  margin: 0 auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    max-width: 750px;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 660px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:0 40px;
  `}
`

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 50px;
  align-items: center;
  margin-bottom: 100px;
  max-width: 684px;
  height: 70px;
`
const SearchContainer = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  align-items: center;
  max-width: 320px;
  height: 50px;
  margin-left: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-right: 0px;
  `};

  ${(props) => props.focus && props.theme.inputFocusBorder};
`
const Container = styled.div`
  position: relative;
  text-align: center;
  color: white;
`

const InnerContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
`
const SearchIcon = styled.img`
  display: flex;
  height: 14px;
  width: 14px;
  margin-right: 25px;
`

const RowHeader = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-wrap: wrap;
  div:first-child {
    margin-bottom:10px
  }
  `};
`
export default Explore
