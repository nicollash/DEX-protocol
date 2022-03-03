import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { weiToEthNum } from 'monox/constants'
import { precise, poolValue } from 'monox/util'
import useStaking from 'hooks/useStaking'

import Label from 'components/Label'
import { RowCenter } from 'components/Row'

const LiquidityColumn = ({
  symbol,
  price,
  pid,
  vusdCredit,
  vusdDebt,
  tokenBalance,
  stakedAmount,
}) => {
  const { calculateTotalSupply } = useStaking()
  const [totalSupplyAmount, setTotalSupplyAmount] = useState(1)

  useEffect(() => {
    let isMounted = true
    calculateTotalSupply(pid).then((totalSupply) => {
      if (isMounted) setTotalSupplyAmount(totalSupply)
    })
    return () => {
      isMounted = false
    }
  }, [])
  const priceData = weiToEthNum(BigNumber(price))
  const tokenBalanceData = weiToEthNum(BigNumber(tokenBalance))
  const vusdBalance = weiToEthNum(BigNumber(vusdCredit - vusdDebt))
  const poolBalance = poolValue(vusdBalance, tokenBalanceData, priceData)
  const stakedBalance = (stakedAmount / totalSupplyAmount) * poolBalance

  return (
    <Col>
      <RowCenter>
        <Label
          text={`$${new Intl.NumberFormat().format(precise(stakedBalance, 4))}`}
          title={`$${new Intl.NumberFormat().format(
            precise(stakedBalance, 4)
          )}`}
          maxWidth={160}
          size="13"
          weight="800"
        />
      </RowCenter>
      <RowCenter>
        <Label
          text={`${new Intl.NumberFormat().format(
            precise(weiToEthNum(BigNumber(stakedAmount)), 3)
          )} ${symbol} LP`}
          title={`${new Intl.NumberFormat().format(
            precise(weiToEthNum(BigNumber(stakedAmount)), 3)
          )} ${symbol} LP`}
          maxWidth={160}
          size="12"
          opacity="0.4"
          weight="800"
        />
      </RowCenter>
    </Col>
  )
}

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export default LiquidityColumn
