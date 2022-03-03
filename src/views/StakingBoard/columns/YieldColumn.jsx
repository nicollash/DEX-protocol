import React, { useEffect, useContext, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { AccountContext } from 'contexts/AccountProvider'
import { weiToEthNum } from 'monox/constants'
import { poolValue } from 'monox/util'
import useStaking from 'hooks/useStaking'

import Label from 'components/Label'
import { RowCenter } from 'components/Row'

const YieldColumn = ({
  pid,
  allocPoint,
  totalAllocPoint,
  lpTokenId,
  price: priceData,
  tokenBalance,
  vusdCredit,
  vusdDebt,
}) => {
  const { infuraStakeContract, monoXContract } = useContext(AccountContext)
  const { stakeContractData, getStakeData, calculateTotalSupply } = useStaking()
  const [stakedLpInPool, setStakedLpInPool] = useState(null)
  const STAKING_ADDRESS = useSelector(({ network }) => network.STAKING_ADDRESS)

  const [lpTotalSupply, setLpTotalSupply] = useState(1)

  useEffect(() => {
    let isMounted = true
    calculateTotalSupply(pid).then((totalSupply) => {
      if (isMounted) setLpTotalSupply(weiToEthNum(BigNumber(totalSupply)))
    })
    return () => {
      isMounted = false
    }
  }, [])

  const getStakedLpInPool = useCallback(async () => {
    if (monoXContract) {
      const allStakedLpInPool = await monoXContract.methods
        .balanceOf(STAKING_ADDRESS, lpTokenId)
        .call()
      if (allStakedLpInPool) {
        setStakedLpInPool(weiToEthNum(new BigNumber(allStakedLpInPool)))
      }
    }
  }, [monoXContract])

  useEffect(() => {
    if (infuraStakeContract) {
      getStakeData()
      getStakedLpInPool()
    }
  }, [monoXContract])

  const {
    monoPerPeriod,
    ratios,
    decay,
    monoPrice,
    periodsPerDay,
  } = stakeContractData

  const currentMonoPerPeriod = monoPerPeriod * ratios

  const dailyMONOs =
    decay !== 1
      ? (currentMonoPerPeriod * (1 - Math.pow(decay, periodsPerDay))) /
        (1 - decay)
      : currentMonoPerPeriod
  const dailyMONOsPerPool = (dailyMONOs * allocPoint) / totalAllocPoint
  const yieldMONOPerDayLP = stakedLpInPool
    ? dailyMONOsPerPool / stakedLpInPool
    : 0

  const price = weiToEthNum(BigNumber(priceData))
  const tokenValue = weiToEthNum(BigNumber(tokenBalance))
  const vusdValue = weiToEthNum(BigNumber(vusdCredit - vusdDebt))
  const poolBalance = poolValue(vusdValue, tokenValue, price)
  const valuePerLp = poolBalance / lpTotalSupply
  const yieldMonoPerDayPerDollar = yieldMONOPerDayLP / valuePerLp

  const yieldPerThousand = yieldMonoPerDayPerDollar * 1000 * monoPrice

  return (
    <Col>
      <RowCenter>
        <Label
          text={`${new Intl.NumberFormat().format(
            yieldPerThousand || 0
          )} USD/day`}
          title={`${new Intl.NumberFormat().format(
            yieldPerThousand || 0
          )} USD/day`}
          maxWidth={160}
          size="13"
          weight="800"
        />
      </RowCenter>
      <RowCenter>
        <Label size="12" weight="800" text={allocPoint} />
        <Label
          size={12}
          weight={800}
          opacity={0.4}
          style={{ marginLeft: '5px' }}
          text="allocPoint"
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

export default YieldColumn
