import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { ACTIONS, TRANSACTION_STATUS } from 'monox/util'
import { weiToEth, weiToEthNum, weiToEthString } from 'monox/constants'
import { precise, poolValue } from 'monox/util'
import { StyledExternalLink } from 'theme'
import { AccountContext } from 'contexts/AccountProvider'
import useStaking from 'hooks/useStaking'
import useWallet from 'hooks/useWallet'
import useModal from 'hooks/useModal'
import SCard from 'views/Swapper/components/SCard'
import { addTransaction } from 'state/transaction/actions'
import Modal from 'components/Modal'
import TransactionRejectModal from 'components/TransactionRejectModal'
import TransactionSuccessModal from 'components/TransactionSuccessModal'
import Spacer from 'components/Spacer'
import Label from 'components/Label'
import { CloseIcon } from 'components/IconButton'
import TokenImage from 'components/TokenImage'
import Input from 'components/Input'
import { RowBetween } from 'components/Row'
import Divider from 'components/Divider'
import StyledIconButton from 'components/StyledIconButton'

const ConfirmStakingModal = ({ onDismiss, poolData, isStake }) => {
  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions)
  const STAKING_ADDRESS = useSelector(({ network }) => network.STAKING_ADDRESS)
  const { chainId } = useWallet()
  const { infuraStakeContract, monoXContract } = useContext(AccountContext)
  const [tokenPercentage, setTokenPercentage] = useState(0)
  const [pendingTxPayload, setPendingTxPayload] = useState(null)
  const [balance, setBalance] = useState(0)
  const [isRejected, setIsRejected] = useState(false)
  const [successResult, setSuccessResult] = useState(false)
  const [amount, setAmount] = useState(0)
  const [yearROI, setYearROI] = useState(0)
  const [focus, setFocus] = useState(false)
  const [stakedLpInPool, setStakedLpInPool] = useState(null)
  const [lpTotalSupply, setLpTotalSupply] = useState(1)

  const {
    depositPool,
    calculateBalance,
    calculateTotalSupply,
    withdrawPool,
    stakeContractData,
    getStakeData,
  } = useStaking()

  useEffect(() => {
    calculateTotalSupply(poolData?.pid).then((totalSupply) => {
      setLpTotalSupply(weiToEthNum(BigNumber(totalSupply)))
    })
  }, [])

  const getStakedLpInPool = useCallback(async () => {
    if (monoXContract) {
      const allStakedLpInPool = await monoXContract.methods
        .balanceOf(STAKING_ADDRESS, poolData.lpTokenId)
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
  }, [])

  useEffect(() => {
    if (poolData) {
      if (!isStake) {
        calculateBalance(poolData.lpTokenId).then((balance) => {
          setBalance(balance)
        })
      } else if (
        isStake &&
        Object.keys(stakeContractData).length > 0 &&
        stakedLpInPool
      ) {
        setBalance(poolData.amount)
      }
      const { allocPoint, totalAllocPoint } = poolData
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

      const price = weiToEthNum(BigNumber(poolData?.price))
      const tokenValue = weiToEthNum(BigNumber(poolData?.tokenBalance))
      const vusdValue = weiToEthNum(
        BigNumber(poolData?.vusdCredit - poolData?.vusdDebt)
      )
      const poolBalance = poolValue(vusdValue, tokenValue, price)
      const valuePerLp = poolBalance / lpTotalSupply
      const yieldMonoPerDayPerDollar = yieldMONOPerDayLP / valuePerLp

      const dailyROI = yieldMonoPerDayPerDollar * monoPrice * 100

      const yearFactor =
        ratios !== 1 ? (1 - Math.pow(ratios, 365)) / (1 - ratios) : 1
      const yearROI = dailyROI * yearFactor
      setYearROI(yearROI)
    }
  }, [poolData, stakeContractData, stakedLpInPool])

  useEffect(() => {
    if (pendingTxPayload && transactions[chainId]) {
      const savedTx = transactions[chainId].find(
        (tx) => tx.startTime === pendingTxPayload.startTime
      )
      if (savedTx && savedTx.status === TRANSACTION_STATUS.PENDING) {
        setSuccessResult(savedTx.tx)
      } else if (savedTx && savedTx.status === TRANSACTION_STATUS.FAIL) {
        setIsRejected(true)
      }
    }
  }, [pendingTxPayload, transactions])

  const handleChangeAmount = (value) => {
    if (typeof value == 'number') {
      setAmount(value)
    } else if (!value || value?.match(/^\d{0,}(\.\d{0,18})?$/)) {
      if (value === '.') {
        setAmount(value)
      } else if (value && value.slice(-1) === '.') {
        setAmount(`${parseFloat(value.slice(0, value.length - 1))}.`)
      } else {
        if (
          value &&
          parseFloat(value).toString() !== value &&
          value.slice(-1) !== '0'
        ) {
          setAmount(
            parseFloat(value)
              .toFixed(19)
              .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
          )
        } else {
          setAmount(value)
        }
      }
    }
  }

  const handleClickMaxButton = () => {
    const stringifiedBalance = weiToEthString(BigNumber(balance))
    setAmount(stringifiedBalance)
  }

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

  const handleConfirmStaking = async () => {
    const payload = {
      token: {
        name: poolData?.name,
        address: poolData?.token,
        symbol: poolData?.symbol,
        chainId,
      },
      amount: amount,
      type: !isStake ? ACTIONS.STAKE : ACTIONS.UNSTAKE,
      status: TRANSACTION_STATUS.REQUESTED,
      startTime: +new Date(),
      chainId,
    }
    if (registerTransaction(payload) === false) {
      return
    }

    setPendingTxPayload(payload)
    if (!isStake) {
      try {
        await depositPool(poolData, amount, payload, balance)
      } catch (err) {
        setIsRejected(true)
      }
    } else {
      try {
        await withdrawPool(poolData, amount, payload, balance)
      } catch (err) {
        setIsRejected(true)
      }
    }
  }

  const [handleTransferSubmit] = useModal(
    <TransactionSuccessModal
      payload={successResult}
      token={poolData.token}
      onDismiss={onDismiss}
    />,
    'success'
  )

  if (isRejected) {
    return (
      <TransactionRejectModal
        onDismiss={onDismiss}
        message={`${!isStake ? 'Stake' : 'Unstake'} ${amount} ${
          poolData?.symbol
        }`}
      />
    )
  }

  if (successResult) {
    return <>{handleTransferSubmit(successResult)}</>
  }

  return (
    <Modal width="520">
      {isStake ? (
        <>
          <TokenRow>
            <Label text={`Unstake`} size="16" weight="800" />
            <Row>
              <MaxButton onClick={handleClickMaxButton}>Max</MaxButton>
              <CloseIcon onClick={onDismiss} />
            </Row>
          </TokenRow>
          <Spacer />
          <SCard
            amount={amount}
            handleChangeAmount={handleChangeAmount}
            currency={poolData}
            showBalance={false}
          />
          <Spacer size="sm" />
          <Label
            text={
              balance
                ? `${weiToEth(BigNumber(balance))} ${
                    poolData?.name
                  } LP Token Available`
                : ''
            }
            align="center"
            opacity={0.5}
            size={13}
            weight="800"
          />
          <Spacer />
          <StyledIconButton
            block
            icon="arrow"
            isPerforming={pendingTxPayload}
            isConfirmSwap={true}
            variant="primary"
            disabled={
              amount === 0 ||
              pendingTxPayload ||
              amount > weiToEthNum(BigNumber(balance))
            }
            onClick={handleConfirmStaking}
          >
            {pendingTxPayload
              ? 'Waiting for Confirmation'
              : amount > weiToEthNum(BigNumber(balance))
              ? 'Insufficient Balance'
              : 'Unstake'}
          </StyledIconButton>
          <Spacer />
          <Row>
            <Col justify="start">
              <Label
                text="Yearly rewards"
                weight={600}
                opacity={0.5}
                size={13}
              />
            </Col>
            <Col justify="flex-end">
              <Label
                text={`${precise(yearROI, 2)}%`}
                weight={600}
                opacity={0.5}
                size={13}
              />
            </Col>
          </Row>
          <Spacer />
        </>
      ) : (
        <>
          <TokenRow>
            <Label
              text={`Deposit ${poolData?.symbol} LP Token`}
              size="16"
              weight="800"
            />
            <Row>
              <CloseIcon onClick={onDismiss} />
            </Row>
          </TokenRow>
          <Spacer size="lg" />
          <RowInput focus={focus}>
            <Input
              size="sm"
              placeholder="0.00"
              type="number"
              value={`${amount}`}
              onChange={(e) => handleChangeAmount(e.target.value)}
              style={{ textAlign: 'left' }}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
            <Label
              text={`${poolData?.symbol} LP token`}
              size="14"
              weight="800"
            />
            <TokenImage
              src={poolData?.logoURI}
              height="28"
              width="28"
              letter={poolData?.symbol && poolData?.symbol[0]}
              style={{
                marginLeft: '11px',
                marginRight: '-8px',
                width: 50,
                height: 50,
                backgroundColor: '#fff',
                boxShadow:
                  '0 10px 25px 0 rgba(188, 195, 207, 0.49), 0 10px 10px 0 rgba(185, 192, 204, 0.3), inset 0 -14px 23px 0 rgba(176, 183, 194, 0.5), inset 0 -10px 10px 0 rgba(253, 244, 229, 0.7)',
              }}
            />
            <Spacer size="sm" />
          </RowInput>
          <Spacer />
          {weiToEth(BigNumber(balance)) !== 0 ? (
            <Label
              text={`${weiToEth(BigNumber(balance))} ${
                poolData?.name
              } LP Token Available`}
              align="center"
              opacity={0.5}
              size={13}
              weight="800"
            />
          ) : (
            <ButtonRow>
              <Label
                text={`You don’t have any ${poolData?.name} LP Token Available`}
                align="center"
                opacity={0.5}
                size={13}
                weight="800"
              />
              &nbsp;
              <StyledExternalLink
                href={`/add/${poolData?.token}`}
                target="__blank"
                style={{ justifyContent: 'flex-start' }}
              >
                <Label
                  color="#2eca93"
                  size={13}
                  text={'Add Liquidity'}
                  weight="800"
                />
              </StyledExternalLink>
            </ButtonRow>
          )}
          <Spacer />
          {weiToEth(BigNumber(balance)) !== 0 && (
            <ButtonRow>
              {[25, 50, 75, 100].map((e, i) => (
                <RowButton
                  onClick={() => {
                    if (balance) {
                      handleChangeAmount(
                        (e / 100) * weiToEth(BigNumber(balance))
                      )
                      setTokenPercentage(e)
                    }
                  }}
                  key={e}
                  active={tokenPercentage === e}
                >
                  {e === 100 ? 'Max' : `${e}%`}
                </RowButton>
              ))}
            </ButtonRow>
          )}
          <Spacer />
          <Divider />
          <Row style={{ margin: '14px 0 15px 0' }}>
            <Col justify="start">
              <Label
                text="Yearly rewards"
                weight={800}
                size={13}
                opacity={0.5}
              />
            </Col>
            <Col justify="flex-end">
              <Label text={`${precise(yearROI, 2)}%`} weight={800} size={13} />
            </Col>
          </Row>
          <Divider />
          <Spacer />
          <StyledIconButton
            block
            icon="arrow"
            isPerforming={pendingTxPayload}
            isConfirmSwap={true}
            variant="primary"
            disabled={
              amount === 0 ||
              pendingTxPayload ||
              amount > weiToEthNum(BigNumber(balance))
            }
            onClick={handleConfirmStaking}
          >
            {pendingTxPayload
              ? 'Waiting for Confirmation'
              : amount > weiToEthNum(BigNumber(balance))
              ? 'Insufficient Balance'
              : 'Stake'}
          </StyledIconButton>
        </>
      )}
    </Modal>
  )
}

const TokenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  align-items: center;
`
const MaxButton = styled.button`
  padding: 5px 19px;
  margin-right: 14px;
  border-radius: 4px;
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  background-color: ${({ theme }) => theme.color.background.main};
  font-size: 12px;
  font-weight: 800;
  color: #212d63;
  outline: none;
  border: none;
  cursor: pointer;
`

export const RowButton = styled.div`
  padding: 6px 20px;
  border-radius: 4px;
  box-shadow: ${(props) =>
    !props.active
      ? `6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,-1px -1px 3px 0 #ffffff;`
      : props.theme.shadows.inset};
  background-color: ${({ theme }) => theme.color.background.main};
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  color: ${(props) => props.theme.color.primary.main};
  :hover {
    color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 2px 2px 4px 0 #d0d8e6, -2px -2px 4px 0 #ffffff,
      -1px -1px 3px 0 #ffffff;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 6px 20px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 6px 15px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 6px 10px;
  `}
`
const Col = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: ${(props) => (props.justify ? props.justify : 'center')};
`
const RowInput = styled(Row)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 50px;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  input {
    margin-left: 30px;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  input {
    margin-left: 15px;
  }
  `}
  ${(props) => props.focus && props.theme.inputFocusBorder}
`

const ButtonRow = styled(RowBetween)`
  padding: 0 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding:0
  `}
`
export default ConfirmStakingModal
