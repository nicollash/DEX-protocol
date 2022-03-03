import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { weiToEth } from 'monox/constants'
import Spacer from 'components/Spacer'
import Input from 'components/Input'

const PoolBar = ({ currency, isCreate, price, onChangePrice, pool }) => {
  const [focus, setFocus] = useState(false)
  const [focusPool, setFocusPool] = useState(false)

  return (
    <>
      <Row>
        <Col>
          <Row>
            <Text>{currency ? `vUSD per ${currency.symbol}` : ''}</Text>
          </Row>
          <RowInput focus={focus}>
            <Input
              size={'sm'}
              placeholder={'0.0'}
              value={
                currency?.notInList && isCreate
                  ? price
                  : weiToEth(BigNumber(pool?.vusdCredit))
              }
              onChange={onChangePrice}
              style={{ textAlign: 'left' }}
              disabled={!(currency?.notInList && isCreate)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </RowInput>
        </Col>
        <Spacer size="md" />
        <Col>
          <Row>
            <Text>Share of Pool</Text>
          </Row>
          <RowInput focus={focusPool}>
            <Input
              size={'sm'}
              placeholder={'0.0'}
              value={currency && currency.notInList ? '100%' : '0.02%'}
              onChange={onChangePrice}
              style={{ textAlign: 'left' }}
              disabled={true}
              onFocus={() => setFocusPool(true)}
              onBlur={() => setFocusPool(false)}
            />
          </RowInput>
        </Col>
      </Row>
      <Spacer />
    </>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 3px;
  justify-content: flex-start;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  width: 170px;
`

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 55px;
  align-items: center;
  width: 170px;
  ${(props) => props.focus && props.theme.inputFocusBorder}
`

const Text = styled.div`
  opacity: 0.5;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color.secondary.main};
`
export default PoolBar
