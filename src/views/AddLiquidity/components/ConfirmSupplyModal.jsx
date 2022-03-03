import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { weiToEthNum, getBalance } from 'monox/constants'
import { showToast, TRANSACTION_STATUS } from 'monox/util'
import { precise, poolValue, amountLPReceive } from 'monox/util'
import config from 'monox/config'
import { AccountContext } from 'contexts/AccountProvider'
import usePool from 'hooks/usePool'
import useModal from 'hooks/useModal'
import useWallet from 'hooks/useWallet'

import { addTransaction } from 'state/transaction/actions'

import Modal from 'components/Modal'
import Spacer from 'components/Spacer'
import Label from 'components/Label'
import { CloseIcon } from 'components/IconButton'
import { RowBetween, RowInput } from 'components/Row'
import Input from 'components/Input'
import StyledIconButton from 'components/StyledIconButton'
import Divider from 'components/Divider'
import TokenImage from 'components/TokenImage'
import { TransactionStartToast } from 'components/ToastPopup'
import TransactionRejectModal from 'components/TransactionRejectModal'
import TransactionSuccessModal from 'components/TransactionSuccessModal'

const ConfirmSupplyModal = ({
  onDismiss,
  currency,
  pool,
  amount,
  redirectUrl,
}) => {
  const { account, chainId, ethereum } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const [isAdding, setIsAdding] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const dispatch = useDispatch()
  const { poolsContract, swapContract } = useContext(AccountContext)
  const { balance, totalSupply } = usePool(
    currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
  )
  const price = weiToEthNum(BigNumber(pool?.price))
  const tokenBalance = weiToEthNum(BigNumber(pool?.tokenBalance))
  const vusdBalance = weiToEthNum(BigNumber(pool?.vusdCredit - pool?.vusdDebt))
  const poolBalance = poolValue(vusdBalance, tokenBalance, price)
  const amountReceive = amountLPReceive(amount, price, poolBalance, totalSupply)
  const sharedPercent =
    ((balance + amountReceive) * 100) / (totalSupply + amountReceive)

  const [handleTransferReject] = useModal(
    <TransactionRejectModal
      onDismiss={onDismiss}
      message={`Add ${amount} ${currency.symbol}`}
    />
  )

  const [handleTransferSubmit] = useModal(
    <TransactionSuccessModal onDismiss={onDismiss} redirectUrl={redirectUrl} />,
    'success'
  )

  const handleSupplyConfirmed = useCallback(async () => {
    const payload = {
      fromCurrency: currency,
      fromAmount: amount,
      type: 'ADD',
      startTime: +new Date(),
      status: TRANSACTION_STATUS.PENDING,
      chainId,
    }
    try {
      setIsAdding(true)
      const balance = await getBalance(ethereum, currency, account)
      const balanceAmount = balance.slice(
        0,
        balance?.length - currency?.decimals
      )
      const aboveBalance = parseFloat(amount) > parseFloat(balanceAmount)
      const amountBigNum = BigNumber(10 ** currency?.decimals)
        .times(BigNumber(amount))
        .toFixed(0)

      if (currency && !currency?.address) {
        await swapContract.methods
          .addLiquidityETH(account)
          .send({ from: account, value: amountBigNum })
          .on('transactionHash', function (tx) {
            payload.tx = tx
            dispatch(addTransaction(payload))
            showToast(<TransactionStartToast />, {
              autoClose: false,
            })
            handleTransferSubmit(tx)
            return tx
          })
      } else {
        const amount = aboveBalance > 0 ? balance : amountBigNum
        await swapContract.methods
          .addLiquidity(currency.address, amount, account)
          .send({ from: account })
          .on('transactionHash', function (tx) {
            payload.tx = tx
            dispatch(addTransaction(payload))
            showToast(<TransactionStartToast />, {
              autoClose: false,
            })
            handleTransferSubmit(tx)
            return tx
          })
      }
      setIsAdding(false)
    } catch (e) {
      handleTransferReject()
      console.log(e)
    }
  }, [])

  useEffect(() => {
    if (!isMounted && poolsContract) {
      setIsMounted(true)
    }
  }, [poolsContract])

  return (
    <Modal>
      <RowBetween>
        <Label text="You will receive" weight={800} />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <Spacer size="md" />
      <RowInput style={{ marginRight: '0px' }}>
        <Input
          size="sm"
          value={precise(amountReceive, 4)}
          disabled
          style={{ textAlign: 'left' }}
        />
        <Label weight={800} size={13} style={{ marginRight: '11px' }}>
          {currency && currency.symbol} {currency && !!currency.symbol && ' LP'}
        </Label>
        <TokenImage
          src={currency?.logoURI}
          height="25"
          width="28"
          letter={currency?.symbol && currency?.symbol[0]}
          style={{ marginRight: '0px' }}
        />
      </RowInput>
      <Spacer size="md" />
      <Divider />
      <Row>
        <Text opacity={0.5}>{currency && currency.symbol} Deposited</Text>
        <Text>{amount}</Text>
      </Row>
      <Divider />
      <Row>
        <Text opacity={0.5}>Rates</Text>
        <Text>
          1 {currency && currency.symbol} =&nbsp;
          {pool && precise(price, 4)} vUSD
        </Text>
      </Row>
      <Divider />
      <Row>
        <Text opacity={0.5}>Share of Pool</Text>
        <Text>{precise(sharedPercent, 2)}%</Text>
      </Row>
      <Divider />
      <Spacer />
      <StyledIconButton
        block
        disabled={isAdding}
        isPerforming={isAdding}
        icon="arrow"
        variant="primary"
        isConfirmSwap={true}
        onClick={handleSupplyConfirmed}
      >
        {isAdding ? 'Waiting for Confirmation' : 'Confirm Supply'}
      </StyledIconButton>
    </Modal>
  )
}

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`

const Text = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
  opacity: ${(props) => props.opacity ?? 1};
`

export default ConfirmSupplyModal
