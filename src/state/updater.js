import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Web3 from 'web3'

import { addTransaction } from 'state/transaction/actions'
import { updateApplication } from 'state/applications/actions'
import { updateSwapTransaction } from 'state/swap/actions'
import useWallet from 'hooks/useWallet'
import useRefresh from 'hooks/useRefresh'
import { ACTIONS, TRANSACTION_STATUS } from 'monox/util'

import ToastPopup, { TransactionFailedToast } from 'components/ToastPopup'

export function shouldCheck(tx) {
  return tx.status === TRANSACTION_STATUS.PENDING
}

export default function Updater() {
  const { chainId, ethereum } = useWallet()
  const { fastRefresh } = useRefresh()

  const dispatch = useDispatch()
  const transactions = useSelector((state) => state.transactions)

  const checkTransactions = () => {
    if (!chainId || !ethereum || !transactions[chainId]) return
    const web3 = new Web3(ethereum)

    transactions[chainId].map((transaction) => {
      if (shouldCheck(transaction)) {
        web3.eth
          .getTransactionReceipt(transaction.tx)
          .then((receipt) => {
            if (receipt && receipt.status) {
              toast.dismiss()
              dispatch(
                addTransaction({
                  ...transaction,
                  status: TRANSACTION_STATUS.SUCCESS,
                  tx: receipt.transactionHash,
                })
              )

              if (transaction?.type === ACTIONS.APPROVE) {
                dispatch(updateApplication())
              } else {
                let customToastPopup
                switch (transaction?.type) {
                  case 'STAKE':
                  case 'UNSTAKE':
                  case 'HARVEST':
                    customToastPopup = (
                      <ToastPopup
                        fromToken={transaction?.token?.symbol}
                        fromAmount={transaction?.amount}
                        chainId={chainId}
                        link={receipt.transactionHash}
                        type={transaction?.type.toLowerCase()}
                      />
                    )
                    break
                  case 'SWAP':
                  case 'WRAP':
                  case 'UNWRAP':
                    dispatch(
                      updateSwapTransaction({
                        isPerforming: false,
                        isRejected: false,
                        successResult: receipt.transactionHash,
                        successEnded: true,
                      })
                    )
                    customToastPopup = (
                      <ToastPopup
                        fromToken={transaction?.fromCurrency}
                        toToken={transaction?.toCurrency}
                        fromAmount={transaction?.fromAmount}
                        toAmount={transaction?.toAmount}
                        chainId={chainId}
                        link={receipt.transactionHash}
                        type={transaction.type.toLowerCase()}
                      />
                    )
                    break
                  default:
                    customToastPopup = (
                      <ToastPopup
                        fromToken={transaction.fromCurrency?.symbol}
                        toToken={transaction.toCurrency?.symbol}
                        fromAmount={transaction.fromAmount}
                        toAmount={transaction.toAmount}
                        chainId={chainId}
                        link={receipt.transactionHash}
                        type={transaction.type.toLowerCase()}
                      />
                    )
                }

                toast.info(customToastPopup)
              }
            } else if (receipt && !receipt.status) {
              toast.dismiss()
              dispatch(
                addTransaction({
                  ...transaction,
                  status: TRANSACTION_STATUS.FAIL,
                })
              )
              if (
                transaction?.type === 'SWAP' &&
                transaction?.type === 'WRAP' &&
                transaction?.type === 'UNWRAP'
              ) {
                dispatch(
                  updateSwapTransaction({
                    isPerforming: false,
                    isRejected: true,
                    successResult: undefined,
                    successEnded: false,
                  })
                )
              }
              toast.info(TransactionFailedToast)
            }
          })
          .catch((error) => {
            toast.dismiss()
            dispatch(
              addTransaction({
                ...transaction,
                status: TRANSACTION_STATUS.FAIL,
              })
            )
            if (
              transaction?.type === 'SWAP' &&
              transaction?.type === 'WRAP' &&
              transaction?.type === 'UNWRAP'
            ) {
              dispatch(
                updateSwapTransaction({
                  isPerforming: false,
                  isRejected: true,
                  successResult: undefined,
                  successEnded: false,
                })
              )
            }
            toast.info(TransactionFailedToast)
            console.error(
              `failed to check transaction hash: ${transaction.tx}`,
              error
            )
          })
      }
    })
  }

  useEffect(() => {
    checkTransactions()
  }, [chainId, ethereum, transactions, fastRefresh, dispatch])

  useEffect(() => {
    window.addEventListener('visibilitychange', checkTransactions)

    return () => {
      window.removeEventListener('visibilitychange', checkTransactions)
    }
  }, [])

  return null
}
