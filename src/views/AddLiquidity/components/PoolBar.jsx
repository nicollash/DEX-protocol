import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import usePool from 'hooks/usePool'
import useWallet from 'hooks/useWallet'
import { weiToEthNum } from 'monox/constants'
import { precise, poolValue, amountLPReceive } from 'monox/util'
import config from 'monox/config'
import Spacer from 'components/Spacer'
import Input from 'components/Input'
import Label from 'components/Label'

const PoolBar = ({ currency, isCreate, onChangePrice, pool, amount }) => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const { totalSupply } = usePool(
    currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
  )
  const [focus, setFocus] = useState(false)
  const [focusPool, setFocusPool] = useState(false)
  const price = weiToEthNum(BigNumber(pool?.price))
  const tokenBalance = weiToEthNum(BigNumber(pool?.tokenBalance))
  const vusdBalance = weiToEthNum(BigNumber(pool?.vusdCredit - pool?.vusdDebt))
  const poolBalance = poolValue(vusdBalance, tokenBalance, price)
  const amountReceive = amountLPReceive(amount, price, poolBalance, totalSupply)
  const sharedPercent = (amountReceive * 100) / (totalSupply + amountReceive)

  return (
    <>
      <Row>
        <Col>
          <Row>
            <Label
              text={currency ? `vUSD per ${currency.symbol}` : ''}
              opacity="0.5"
              size="13"
              weight="800"
              align="left"
              style={{ marginBottom: '10px' }}
            />
          </Row>
          <RowInput focus={focus}>
            <Input
              size={'sm'}
              placeholder={'0.0'}
              value={precise(price, 4)}
              onChange={onChangePrice}
              style={{ textAlign: 'left', margin: '0 30px' }}
              disabled={!(currency?.notInList && isCreate)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </RowInput>
        </Col>
        <Spacer size="md" />
        <Col>
          <Row>
            <Label
              text="Increased Pool Share"
              opacity="0.5"
              size="13"
              weight="800"
              align="left"
              style={{ marginBottom: '10px' }}
            />
          </Row>
          <RowInput focus={focusPool}>
            <Input
              size={'sm'}
              placeholder={'0.0'}
              value={precise(sharedPercent, 2) + '%'}
              style={{ textAlign: 'left', margin: '0 30px' }}
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
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  `}
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  max-width: 200px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: auto;
  max-width:unset;
  `}
`

const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 55px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: auto;
  `}
  ${(props) => props.focus && props.theme.inputFocusBorder}
`
export default PoolBar
