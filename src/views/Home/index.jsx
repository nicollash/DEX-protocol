import React from 'react'
import styled from 'styled-components'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import Label from 'components/Label'
import { Row } from 'components/Row'
import Spacer, { SpacerResponsive } from 'components/Spacer'
import { usePrismic } from 'hooks/usePrismic'

import PoolPair from 'views/Home/components/PoolPair'
import MonoXProtocol from 'views/Home/components/MonoXProtocol'
import AboutSinglePool from 'views/Home/components/AboutSinglePool'
import AboutEfficiency from 'views/Home/components/AboutEfficiency'
import AboutStablecoin from 'views/Home/components/AboutStablecoin'
import PartnerCompanies from 'views/Home/components/PartnerCompanies'
import SearchBar from 'components/SearchBar'
import Team from 'views/Home/components/Team'
import HeaderCard from 'views/Explore/components/HeaderCard'

import MostActive from 'assets/img/most-active.png'
import BiggestGains from 'assets/img/biggest-gains.png'
import BiggestDrops from 'assets/img/biggest-drops.png'
import RecentAdded from 'assets/img/recently-added.png'
import HomeImg from 'assets/img/explore.png'
import Bullets from 'assets/img/bullte.svg'

const Home = () => {
  const { partnerCompanies, teamMembers } = usePrismic()

  const filters = {
    'recently-added': {
      image: { url: RecentAdded },
      name: 'Recently Added',
      short_description: [{ text: 'Tokens added in the past 24 hours' }],
      tableHeading: 'Recently Added (24H)',
    },
    'biggest-gains': {
      image: { url: BiggestGains },
      name: 'Biggest Gains',
      short_description: [{ text: 'Top gains in the last 24 hours' }],
      tableHeading: 'Biggest Gains (24H)',
    },
    'biggest-drops': {
      image: { url: BiggestDrops },
      name: 'Biggest Drops',
      short_description: [{ text: 'Top drops in the last 24 hours' }],
      tableHeading: 'Biggest Losses (24H)',
    },
    'most-active': {
      image: { url: MostActive },
      name: 'Most Active',
      short_description: [{ text: 'Top 100 tokens by trading volume' }],
      tableHeading: 'Most Active',
    },
  }

  return (
    <HelmetProvider>
      <HomePage>
        <Background src={HomeImg} />
        <Helmet>
          <title>Home Page | MonoX</title>
        </Helmet>
        <Row style={{ marginTop: '46px', justifyContent: 'center', zIndex: 3 }}>
          <Label size="42" weight="800" align="center" color="white">
            Welcome to the next <br /> generation of DeFi liquidity
          </Label>
        </Row>
        <Spacer size="lg" />
        <SearchBar
          style={{
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
          }}
          isHome={false}
          innerStyle={{ backgroundColor: 'transparent', color: 'white' }}
        />
        <Spacer size="xl" />
        <Spacer size="xl" />
        <Container>
          <HeaderCard collections={filters} clickable />
          <SpacerResponsive />
          <PoolPair />
          <SpacerResponsive />
          <AboutSinglePool />
          <SpacerResponsive />
          <AboutEfficiency />
          <SpacerResponsive />
          <AboutStablecoin />
          <SpacerResponsive />
          <MonoXProtocol />
          <SpacerResponsive />
          <Team members={teamMembers} />
          <PartnerCompanies companies={partnerCompanies} />
        </Container>
      </HomePage>
    </HelmetProvider>
  )
}

const Container = styled.div`
  max-width: 1012px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin:auto
  `};
  li {
    padding: 0 0 0 25px;
    list-style: none;
    background-image: url(${Bullets});
    background-repeat: no-repeat;
    background-position: left top;
    background-size: 17px;
    background-position-y: 4px;
  }
`
const HomePage = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  max-width: 1200px;
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
const Background = styled.img`
  width: 100%;
  height: 530px;
  margin-top: -70px;
  position: absolute;
  left: 0;
  z-index: 1;
`
export default Home
