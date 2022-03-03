import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import useStaking from 'hooks/useStaking'
import useWallet from 'hooks/useWallet'
import { addTransaction } from 'state/transaction/actions'
import { weiToEthNum } from 'monox/constants'
import { Col } from 'views/StakingBoard/index'

import Label from 'components/Label'
import { Row } from 'components/Row'
import TokenImage from 'components/TokenImage'

import { ACTIONS, TRANSACTION_STATUS, precise } from 'monox/util'

import InactiveLogo from 'assets/img/logo/logo.png'

const EarningsColumn = ({ poolData, pid }) => {
  const dispatch = useDispatch()
  const { chainId } = useWallet()
  const [isHavesting, setIsHavesting] = useState(false)
  const [earningRewards, setEarningRewards] = useState(0)
  const { getEarnings, havestRewards } = useStaking()
  const transactions = useSelector((state) => state.transactions)

  const registerTransaction = (payload) => {
    if (transactions[chainId]) {
      const stakeTransactions = transactions[chainId].filter(
        (tx) =>
          (tx.type === ACTIONS.STAKE || tx.type === ACTIONS.UNSTAKE) &&
          tx.status === TRANSACTION_STATUS.REQUESTED
      )
      if (stakeTransactions.length > 0) {
        return false
      }
    }

    dispatch(addTransaction(payload))
    return true
  }

  const handleHavest = async () => {
    if (isHavesting) {
      return
    }
    const payload = {
      token: {
        name: poolData.name,
        address: poolData.token,
        symbol: poolData.symbol,
        chainId,
      },
      amount: earningRewards,
      type: ACTIONS.HARVEST,
      status: TRANSACTION_STATUS.REQUESTED,
      startTime: +new Date(),
      chainId,
    }
    if (registerTransaction(payload) === false) {
      return
    }

    setIsHavesting(true)
    const tx = await havestRewards(pid, payload)
    if (!tx) {
      setIsHavesting(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const getBootstrapData = async () => {
      const earningData = await getEarnings(pid)
      if (isMounted && earningData)
        setEarningRewards(weiToEthNum(new BigNumber(earningData)))
    }
    getBootstrapData()
    return () => {
      isMounted = false
    }
  }, [getEarnings, pid])

  return (
    <Row>
      <Col icon>
        <TokenImage src={InactiveLogo} width="36" height="32" />
      </Col>
      <Col last>
        <Row>
          <Label
            text={`${new Intl.NumberFormat().format(
              precise(earningRewards, 2)
            )} MONO`}
            title={`${new Intl.NumberFormat().format(
              precise(earningRewards, 2)
            )} MONO`}
            maxWidth={130}
            size="13"
            weight="800"
          />
        </Row>
        {!earningRewards || earningRewards === 0 ? (
          <Row>
            <Label text="No Rewards" opacity="0.5" size="12" weight="800" />
          </Row>
        ) : (
          <Row onClick={handleHavest} disabled={isHavesting}>
            <Label
              text={isHavesting ? 'Harvesting...' : 'Harvest now'}
              size="13"
              weight="800"
              primary
              pointer
            />
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default EarningsColumn
