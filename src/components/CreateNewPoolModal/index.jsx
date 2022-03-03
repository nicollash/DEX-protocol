import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Spinner from 'react-svg-spinner'
import styled from 'styled-components'

import useWallet from 'hooks/useWallet'
import useModal from 'hooks/useModal'
import useCreatePool from 'hooks/useCreatePool'

import { ACTIONS, TRANSACTION_STATUS } from 'monox/util'

import Spacer from 'components/Spacer'
import Label from 'components/Label'
import Modal from 'components/Modal'
import ModalTitle from 'components/ModalTitle'
import TransactionRejectModal from 'components/TransactionRejectModal'
import TransactionSuccessModal from 'components/TransactionSuccessModal'

const CreateNewPoolModal = ({ onDismiss, currency, amount, price }) => {
  const { onCreatePool } = useCreatePool()
  const transactions = useSelector((state) => state.transactions)
  const [isFailed, setFailed] = useState(false)
  const [pendingTxPayload, setPendingTxPayload] = useState(null)
  const [successResult, setSuccessResult] = useState(false)
  const { chainId } = useWallet()

  useEffect(() => {
    handleCreatePool()
  }, [])

  useEffect(() => {
    if (pendingTxPayload && transactions[chainId]) {
      const savedTx = transactions[chainId].find(
        (tx) => tx.startTime === pendingTxPayload.startTime
      )
      if (savedTx && savedTx.status === TRANSACTION_STATUS.PENDING) {
        setSuccessResult(savedTx.tx)
      }
    }
  }, [pendingTxPayload, transactions])

  const handleCreatePool = async () => {
    const payload = {
      fromCurrency: currency,
      fromAmount: amount,
      type: ACTIONS.CREATE,
      status: TRANSACTION_STATUS.PENDING,
      startTime: +new Date(),
      chainId,
    }
    setPendingTxPayload(payload)
    try {
      const tx = await onCreatePool(currency, amount, price, payload)
    } catch (err) {
      console.log(err)
      setFailed(true)
    }
  }

  const [handleTransferSubmit] = useModal(
    <TransactionSuccessModal redirectUrl="/pool" onDismiss={onDismiss} />,
    'success'
  )

  if (isFailed) {
    return (
      <TransactionRejectModal
        onDismiss={onDismiss}
        message={`Create ${amount} ${currency?.symbol}`}
      />
    )
  }

  if (successResult) {
    return <>{handleTransferSubmit(successResult)}</>
  }

  return (
    <Modal>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Spinner />
        <ModalTitle size="16" text="Waiting For Confirmation" />
        <Label weight={600} text={`Supplying ${amount} ${currency?.symbol}`} />
        <Spacer size="sm" />
        <Footer>Confirm this transaction in your wallet</Footer>
      </div>
    </Modal>
  )
}

const Footer = styled.div`
  box-sizing: border-box;
  min-width: 0px;
  font-size: 12px;
  color: rgb(86, 90, 105);
  text-align: center;
  margin: 0px;
`

export default CreateNewPoolModal
