import React from 'react'
import styled from 'styled-components'

import { RowFixed, RowBetween } from 'components/Row'

import Popular from 'assets/img/populer.png'
import Chart from 'assets/img/explore-chart.png'
import Coin from 'assets/img/doller-coin.png'
import poolImg from 'assets/img/poolImg.svg'
import liquidityImg from 'assets/img/liquidityImg.svg'

const pageData = {
  add: {
    title: 'Tip',
    img: liquidityImg,
    link: '',
    content: `When you add liquidity, you will receive pool tokens representing
  your position. These tokens automatically earn fees proportional to
  your share of the pool, and can be redeemed at any time.`,
  },
  remove: {
    title: 'Tip',
    img: liquidityImg,
    link: '',
    content: `Removing pool tokens converts your position back into underlying 
  tokens at the current rate proportional to your share of the pool. Accrued 
  fees are included in the amounts you receive.`,
  },
  pool: {
    title: 'Liquidity provider rewards',
    img: poolImg,
    link: 'Read more about providing liquidity',
    content: `Liquidity providers earn a 0.3% fee on all trades proportional to 
  their share of the pool. Fees are added to the pool, accrue in real time and 
  can be claimed by withdrawing your liquidity.`,
  },
  top_new: {
    title: 'Top New Tokens',
    link: '',
    img: Coin,
    content: '',
  },
  popular: {
    title: 'Most Popular',
    link: '',
    img: Popular,
    content: '',
  },
  farm: {
    title: 'Yield Farming',
    link: '',
    img: Chart,
    content: '',
  },
}

const TipCard = ({ page }) => {
  const data = pageData[page]

  return (
    <Row page={page}>
      <RowFixed justify="flex-end">
        <TextCard>
          <Tip>{data.title}</Tip>
          <Content>{data.content}</Content>
          {data?.link ? (
            <Link
              onClick={() => {
                page === 'pool' &&
                  window.open(
                    'https://docs.monox.finance/getting-started/liquidity'
                  )
              }}
            >
              {data.link}
            </Link>
          ) : (
            ''
          )}
        </TextCard>
      </RowFixed>
      <ImageContainer justify="flex-end" page={page}>
        <img src={data.img} style={{ width: '100%' }} alt="data" />
      </ImageContainer>
    </Row>
  )
}

const Row = styled(RowBetween)`
  margin: auto;
  margin-top: 30px;
  position: relative;
  max-width: ${({ page }) => (page === 'pool' ? '700px' : '550px')};
  min-height: ${({ page }) => (page === 'pool' ? '160px' : '140px')};
  width: 100%;
  border-radius: 50px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    margin-bottom: 40px
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`
const TextCard = styled.div`
  padding: 23px 20px 23px 50px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 23px 30px;
  `}
`
const Link = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: ${(props) => props.theme.color.font.primary};
  margin-top: 11px;
  text-decoration: underline;
  cursor: pointer;
`
const Tip = styled.div`
  font-size: 17px;
  font-family: Nunito;
  font-weight: 800;
  margin-bottom: 7px;
  color: ${({ theme }) => theme.color.secondary.main};
`
const ImageContainer = styled(RowFixed)`
  width: 400px;
  height: ${({ page }) => (page === 'pool' ? '160px' : '140px')};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  height: 200px;
  `}
  img {
    height: 100%;
  }
`
const Content = styled.div`
  opacity: 0.5;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.23;
  color: ${({ theme }) => theme.color.secondary.main};
`

export default TipCard
