import React from 'react'
import styled from 'styled-components'

import Label from 'components/Label'
import Spacer from 'components/Spacer'
import { ColumnCenter } from 'components/Column'

const PairCard = ({ title, content }) => (
  <CardContainer>
    <Label
      text={title}
      font="20"
      weight="800"
      style={{ marginBottom: '14px' }}
    />
    <Label text={content} opacity="0.5" weight="800" size="14" />
  </CardContainer>
)

const PoolPair = () => {
  return (
    <>
      <ColumnCenter>
        <Label text="Liquidity Pool Pairs" size="40" weight="800" />
        <Label
          text="Create capital inefficiencies"
          size="16"
          weight="800"
          opacity="0.5"
        />
      </ColumnCenter>
      <Spacer size="lg" />
      <Grid>
        <PairCard
          title="Liquidity Pool Pairs"
          content="Liquidity Providers have to deposit multiple tokens to the pool."
        />
        <PairCard
          title="Capital Expensive"
          content="Trades often consist of multiple swaps between different pools, 
          and each swap has an associated fee."
        />
        <PairCard
          title="Siloed Capital"
          content="Liquidity pairs design results in siloed capital; there is no need 
          for liquidity locked in Multiple Paris."
        />
      </Grid>
    </>
  )
}

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`
const CardContainer = styled.div`
  width: 220px;
  min-height: 125px;
  padding: 40px 40px 35px 40px;
  border-radius: 38px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  margin: 15px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 20px;
  `};
`

export default PoolPair
