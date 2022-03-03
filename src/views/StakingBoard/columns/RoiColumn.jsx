import React, { useEffect, useContext, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { AccountContext } from 'contexts/AccountProvider'
import { precise, poolValue } from 'monox/util'
import { weiToEthNum } from 'monox/constants'
import useStaking from 'hooks/useStaking'

import Label from 'components/Label'

const RoiColumn = ({
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
    let isMounted = true
    if (monoXContract) {
      monoXContract.methods
        .balanceOf(STAKING_ADDRESS, lpTokenId)
        .call((error, allStakedLpInPool) => {
          if (isMounted)
            setStakedLpInPool(weiToEthNum(new BigNumber(allStakedLpInPool)))
        })
    }
    return () => {
      isMounted = false
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

  const dailyROI = yieldMonoPerDayPerDollar * monoPrice * 100
  const monthFactor = decay !== 1 ? (1 - Math.pow(decay, 30)) / (1 - decay) : 1

  const yearFactor = decay !== 1 ? (1 - Math.pow(decay, 365)) / (1 - decay) : 1

  const monthROI = dailyROI * monthFactor
  const yearROI = dailyROI * yearFactor

  return (
    <Col>
      <Label
        text={`${new Intl.NumberFormat().format(precise(yearROI, 2))}% (1y)`}
        title={`${new Intl.NumberFormat().format(precise(yearROI, 2))}% (1y)`}
        maxWidth={160}
        size="13"
        weight="800"
      />
      <Label
        text={`${new Intl.NumberFormat().format(precise(monthROI, 2))}% (1m)`}
        title={`${new Intl.NumberFormat().format(precise(monthROI, 2))}% (1m)`}
        maxWidth={160}
        size="13"
        weight="800"
      />
      <Label
        text={`${new Intl.NumberFormat().format(precise(dailyROI, 2))}% (1d)`}
        title={`${new Intl.NumberFormat().format(precise(dailyROI, 2))}% (1d)`}
        maxWidth={160}
        size="13"
        weight="800"
      />
    </Col>
  )
}

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export default RoiColumn
