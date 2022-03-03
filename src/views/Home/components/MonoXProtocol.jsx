import React from 'react'
import styled from 'styled-components'

import Label from 'components/Label'
import { RowCenter } from 'components/Row'
import { ColumnCenter } from 'components/Column'

import SwappingAmm from 'assets/img/swapping-amm.png'
import LendingBorrowing from 'assets/img/lending-borrowing.png'
import Derivatives from 'assets/img/derivatives.png'
import LowerTradingFees from 'assets/img/lower-trading-fees.png'
import LessCapitalRequired from 'assets/img/less-capital-required.png'
import LessCapitalSiloed from 'assets/img/less-capital-siloed.png'
import ProtocolImg from 'assets/img/protocol.png'
import MonoRobot from 'assets/img/mono-robot.svg'
import Spacer, { SpacerResponsive } from 'components/Spacer'

const ProtocolCard = ({ title, content, src }) => (
  <Item>
    <RowCenter>
      <img src={src} height="80" width="70" />
    </RowCenter>
    <Label
      text={title}
      font="16"
      weight="900"
      align="center"
      style={{ marginBottom: '20px', marginTop: '30px' }}
    />
    <Label text={content} opacity="0.5" weight="800" size="13" />
  </Item>
)

const MonoXProtocol = () => {
  return (
    <>
      <Background src={ProtocolImg} />
      <SpacerResponsive size="90" />
      <ColumnCenter>
        <Label text="MonoX Protocol" weight="800" size="32" />
        <Label weight="800" size="14" opacity="0.5" align="center">
          Single token liquidity pools provides users with
          <br /> superior DeFi products and services
        </Label>
      </ColumnCenter>
      <Grid>
        <ProtocolCard
          title="SWAPPING (AMM)"
          content="Exchanging Token A with Token B always works by swapping Token A to vUSD and then from vUSD to Token B."
          src={SwappingAmm}
        />
        <ProtocolCard
          title="LENDING & BORROWING"
          content="Optimizes process as no need to withdraw/reserve two tokens to keep the ratio the same."
          src={LendingBorrowing}
        />
        <ProtocolCard
          title="DERIVATIVES"
          content="Can create options and futures markets using single token pool design."
          src={Derivatives}
        />
        <ProtocolCard
          title="LOWER TRADING FEES"
          content="No more swapping between multiple pools, and each swap having an associated fee."
          src={LowerTradingFees}
        />
        <ProtocolCard
          title="LESS CAPITAL REQUIRED"
          content="Liquidity Providers only have to deposit one token to the pool. Projects launching a token do not need to provide extra liquidity for the pair. "
          src={LessCapitalRequired}
        />
        <ProtocolCard
          title="LESS CAPITAL SILOED"
          content="No need for multiple pool pairs that lock capital away from the rest of the DeFi ecosystem.  "
          src={LessCapitalSiloed}
        />
      </Grid>
      <MonoRobotImage src={MonoRobot}></MonoRobotImage>
      <Spacer size="xl" />
    </>
  )
}

const Grid = styled.div`
  display: grid;
  margin: auto;
  grid-template-columns: repeat(3, 1fr);
  max-width: 1012px;
  grid-column-gap: 150px;
  grid-row-gap: 50px;
  margin-top: 70px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 100px;
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 80px;
    margin-top:30px
    `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    text-align: center;
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 39px;
    max-width:300px
  `}
`
const MonoRobotImage = styled.img`
  position: absolute;
  right: 65px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    right:0
  `}
`

const Item = styled.div`
  justify-content: center;
  flex-direction: column;
  justify-self: center;
`
const Background = styled.img`
  width: 100%;
  height: 840px;
  position: absolute;
  left: 0;
  z-index: -1;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height: 1050px;
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 1000px;
    `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 1300px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 1630px;
  `}
`

export default MonoXProtocol
