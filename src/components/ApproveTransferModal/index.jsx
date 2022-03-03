import React, { useState, useCallback, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from 'react-svg-spinner'

import { AccountContext } from 'contexts/AccountProvider'
import useApprove from 'hooks/useApprove'
import useWallet from 'hooks/useWallet'
import { addTransaction } from 'state/transaction/actions'

import { ACTIONS, TRANSACTION_STATUS } from 'monox/util'

import Button from 'components/Button'
import Modal from 'components/Modal'
import ModalActions from 'components/ModalActions'
import ModalTitle from 'components/ModalTitle'
import Label from 'components/Label'
import TransactionRejectModal from 'components/TransactionRejectModal'

const ApproveTransferModal = ({
  onDismiss,
  ERC20TokenAddress,
  setIsApproved,
  liquidity = false,
}) => {
  const dispatch = useDispatch()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [isFailed, setIsFailed] = useState(false)
  const { onApprove } = useApprove(setIsFailed)
  const { chainId } = useWallet()
  const { getAllowance } = useContext(AccountContext)
  const transactions = useSelector((state) => state.transactions)
  const { isUpdated } = useSelector((state) => state.application)

  const handleApprove = useCallback(async () => {
    try {
      const tempTransactionTime = +new Date()
      const payload = {
        type: ACTIONS.APPROVE,
        status: TRANSACTION_STATUS.PENDING,
        startTime: tempTransactionTime,
        chainId,
        isChecked: false,
        tx: undefined,
      }
      setRequestedApproval(true)
      onApprove(ERC20TokenAddress, payload)
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval, ERC20TokenAddress, onDismiss])

  useEffect(() => {
    const getAllowanceCallback = async () => {
      const allowance = await getAllowance(ERC20TokenAddress, true)
      setIsApproved(Number(allowance))
    }
    if (transactions[chainId]) {
      const savedTx = transactions[chainId].find(
        (tx) => tx.type === ACTIONS.APPROVE && !tx?.isChecked
      )
      if (savedTx && savedTx.status === TRANSACTION_STATUS.SUCCESS) {
        if (liquidity) {
          getAllowanceCallback()
        }
        setRequestedApproval(false)
        dispatch(
          addTransaction({
            ...savedTx,
            isChecked: true,
          })
        )
        if (savedTx.tx) {
          onDismiss()
        }
      }
    }
  }, [transactions, isUpdated])

  if (isFailed) {
    return <TransactionRejectModal onDismiss={onDismiss} />
  }

  return (
    <Modal maxWidth>
      <ModalTitle text="Approve to transfer" />
      {requestedApproval && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Spinner />
          <Label size="12" text="Waiting for the transaction" />
        </div>
      )}
      <ModalActions>
        <Button
          disabled={requestedApproval}
          text="Approve"
          onClick={handleApprove}
        />
      </ModalActions>
    </Modal>
  )
}

export default ApproveTransferModal
