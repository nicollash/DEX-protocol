import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import BigNumber from 'bignumber.js'

import Label from 'components/Label'
import { RowCenter } from 'components/Row'

import useStaking from 'hooks/useStaking'
import { weiToEthNum } from 'monox/constants'
import { precise, poolValue } from 'monox/util'

import helpOutline from 'assets/img/help-outline.png'
import helpGreen from 'assets/img/help-green.png'

const StakedColumn = ({
  token,
  pid,
  amount,
  price,
  symbol,
  tokenBalance,
  vusdCredit,
  vusdDebt,
}) => {
  const [totalSupply, setTotalSupply] = useState(0)
  const { calculateTotalSupply } = useStaking()

  const priceData = weiToEthNum(BigNumber(price))
  const amountData = weiToEthNum(BigNumber(amount))
  const tokenBalanceData = weiToEthNum(BigNumber(tokenBalance))
  const vusdBalance = weiToEthNum(BigNumber(vusdCredit - vusdDebt))
  const poolBalance = poolValue(vusdBalance, tokenBalanceData, priceData)
  const lpValue = (poolBalance * amountData) / totalSupply
  const vusdDebtData = weiToEthNum(BigNumber(vusdDebt))

  const l1 = lpValue
  const l2 =
    (amountData * (tokenBalanceData - vusdDebtData / priceData)) / totalSupply
  const l3 = vusdBalance < 0 ? 0 : (amountData * vusdBalance) / totalSupply

  useEffect(() => {
    let isMounted = true
    if (token && amount) {
      calculateTotalSupply(pid).then((totalSupply) => {
        if (isMounted) setTotalSupply(weiToEthNum(BigNumber(totalSupply)))
      })
    }
    return () => {
      isMounted = false
    }
  }, [token, pid, amount])

  return (
    <Col>
      <RowCenter>
        <Label
          text={`$${new Intl.NumberFormat().format(precise(l1, 4))}`}
          title={`$${new Intl.NumberFormat().format(precise(l1, 4))}`}
          maxWidth={160}
          size="13"
          weight="800"
        />
      </RowCenter>
      <RowCenter>
        <Label
          text={`${new Intl.NumberFormat().format(
            precise(amountData, 4)
          )} ${symbol} LP`}
          title={`${new Intl.NumberFormat().format(
            precise(amountData, 4)
          )} ${symbol} LP`}
          maxWidth={160}
          size="12"
          opacity="0.4"
          weight="800"
        />
        <Helper
          data-tip={`
            <div class="help-body">
              <span>${precise(l2, 4)} ${symbol}</span>
              <span>${precise(l3, 4)} vUSD</span>
            </div>
          `}
          data-iscapture="true"
        />
        <ReactTooltip
          html
          effect="solid"
          place="right"
          className="helper-tooltip"
          arrowColor="transparent"
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

const Helper = styled.span`
  background: url(${helpOutline}) no-repeat;
  background-size: 12px 12px;
  width: 13px;
  height: 13px;
  margin-left: 5px;

  :hover {
    background: url(${helpGreen}) no-repeat;
    background-size: 12px 12px;
  }
`

export default StakedColumn
