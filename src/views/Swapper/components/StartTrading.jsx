import React from 'react'
import styled from 'styled-components'

import { precise } from 'monox/util'

import Label from 'components/Label'
import { Row } from 'components/Row'

import SwapGreenIcon from 'assets/img/swap-convert.svg'

const StartTrading = ({ toCurrency, fromCurrency, toAmount, fromAmount }) => {
  return (
    <TradeContainer>
      <Row>
        <Label
          text="Convert"
          size="20"
          weight="800"
          style={{ marginRight: '12px' }}
        />
        <Label
          text={fromCurrency.symbol}
          size="20"
          weight="800"
          color="#41dea2"
        />
        <Swap src={SwapGreenIcon} style={{ width: '15px' }} />
        <Label
          text={toCurrency.symbol}
          size="20"
          weight="800"
          color="#41dea2"
        />
      </Row>
      {toAmount > 0 && fromAmount > 0 ? (
        <Row>
          <Label
            text={`1 ${fromCurrency?.symbol} = ${precise(
              toAmount / fromAmount,
              6
            )} ${toCurrency?.symbol}`}
            size="12"
            weight="800"
            opacity={0.5}
          />
        </Row>
      ) : null}
    </TradeContainer>
  )
}

const TradeContainer = styled.div`
  border-radius: 30px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  background-color: ${(props) => props.theme.color.background.main};
  padding: 34px 40px;
  margin-top: 50px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-bottom:2rem;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 34px 30px;`}
`
const Swap = styled.img`
  height: 14px;
  margin: 0 8px;
`
export default StartTrading
