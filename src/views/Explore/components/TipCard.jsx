import React from 'react'
import styled from 'styled-components'

import { RowBetween } from 'components/Row'
import Label from 'components/Label'

import InnerPopular from 'assets/img/inner-popular.png'
import InnerChart from 'assets/img/inner-chart.png'
import InnerCoin from 'assets/img/inner-coin.png'

const filters = {
  top_new: InnerCoin,
  most_popular: InnerPopular,
  yield_farming: InnerChart,
}

const TipCard = ({ filter, data }) => {
  return (
    <Row>
      <Contain>
        <Label
          text={data?.long_name}
          size="30"
          weight="800"
          style={{ marginBottom: '7px' }}
        />
        <Label opacity="0.5" size="14" weight="800">
          {data?.description?.[0]?.text}
        </Label>
      </Contain>
      <Div>
        <Img src={filters[filter]} alt="filter"/>
      </Div>
    </Row>
  )
}

const Row = styled(RowBetween)`
  margin: auto;
  margin-top: 30px;
  position: relative;
  min-height: 200px;
  width: 100%;
  border-radius: 50px;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`
const Contain = styled.div`
  padding: 35px;
`
const Img = styled.img`
  display: block;
  margin-bottom: -2px;
  margin-right: -10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 50%;
  margin-left: auto;
  margin-right: 0px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width:80%;
  `}
`

const Div = styled.div`
  align-self: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width:100%
  `}
`
export default TipCard
