import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import Spinner from 'react-svg-spinner'

import { AccountContext } from 'contexts/AccountProvider'
import useModal from 'hooks/useModal'
import useWallet from 'hooks/useWallet'
import { addTransaction } from 'state/transaction/actions'
import { precise, showToast, TRANSACTION_STATUS } from 'monox/util'

import Modal from 'components/Modal'
import ModalTitle from 'components/ModalTitle'
import Spacer from 'components/Spacer'
import TransactionRejectModal from 'components/TransactionRejectModal'
import TransactionSuccessModal from 'components/TransactionSuccessModal'
import Label from 'components/Label'
import { TransactionStartToast } from 'components/ToastPopup'

const ConfirmRemoveModal = ({
  onDismiss,
  ERC20Token,
  symbol,
  amount,
  maxClicked,
  lPAmount,
  redirectUrl,
  willRecieveToken,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { swapContract } = useContext(AccountContext)
  const { account, chainId } = useWallet()
  const dispatch = useDispatch()

  const [handleTransferSubmit] = useModal(
    <TransactionSuccessModal redirectUrl={redirectUrl} />,
    'success'
  )

  const [handleTransferReject] = useModal(
    <TransactionRejectModal
      onDismiss={onDismiss}
      message={`Remove ${amount} ${symbol}`}
    />
  )

  const liquidityHandler = useCallback(async () => {
    const payload = {
      fromCurrency: ERC20Token,
      fromAmount: willRecieveToken,
      type: 'REMOVE',
      status: TRANSACTION_STATUS.PENDING,
      startTime: +new Date(),
      chainId,
    }
    try {
      setIsAdding(true)
      const amountBigNum = BigNumber(10 ** 18)
        .times(BigNumber(amount))
        .toFixed(0)
      let liquidity
      const amountSend = maxClicked ? lPAmount : amountBigNum
      if (ERC20Token && !ERC20Token?.address) {
        liquidity = await swapContract.methods
          .removeLiquidityETH(amountSend, account, 0, 0)
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
      } else {
        liquidity = await swapContract.methods
          .removeLiquidity(ERC20Token?.address, amountSend, account, 0, 0)
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
    if (!isMounted && swapContract) {
      liquidityHandler()
      setIsMounted(true)
    }
  }, [swapContract])

  return (
    <Modal>
      {isAdding ? (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Spinner />
          <ModalTitle size="12" text="Waiting For Confirmation" />
        </div>
      ) : (
        <></>
      )}
      <Spacer size="sm" />
      <Label size="14" weight="600" align="center">{`Removing ${precise(
        amount,
        6
      )} ${symbol} LP`}</Label>
      <Spacer size="sm" />
      <Label size={12} align="center">
        Confirm this transaction in your wallet
      </Label>
    </Modal>
  )
}

export default ConfirmRemoveModal
