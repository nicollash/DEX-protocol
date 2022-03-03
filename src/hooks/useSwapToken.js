import React, { useCallback, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWallet from 'hooks/useWallet'
import BigNumber from 'bignumber.js'

import { updateSwapTransaction } from 'state/swap/actions'
import { addTransaction } from 'state/transaction/actions'
import { AccountContext } from 'contexts/AccountProvider'

import { showToast, TRANSACTION_STATUS } from 'monox/util'
import config from 'monox/config'

import { TransactionStartToast } from 'components/ToastPopup'

const useSwapToken = () => {
  const { account, chainId } = useWallet()
  const {
    poolsContract,
    infuraContract,
    swapContract,
    WETHContract,
  } = useContext(AccountContext)
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS

  const tolerance = useSelector(({ settings }) => settings.swapTolerance)

  const dispatch = useDispatch()

  const onGetAmountIn = useCallback(
    async (tokenIn, tokenOut, amountOut) => {
      try {
        const amountOutBigNum = BigNumber(10 ** tokenOut.decimals)
          .times(BigNumber(amountOut))
          .toFixed(0)
        if (swapContract) {
          const tx = await swapContract.methods
            .getAmountIn(
              tokenIn?.address || WRAPPED_MAIN_ADDRESS,
              tokenOut?.address || WRAPPED_MAIN_ADDRESS,
              amountOutBigNum
            )
            .call()
          return tx
        } else if (infuraContract) {
          const tx = await infuraContract.methods
            .getAmountIn(
              tokenIn?.address || WRAPPED_MAIN_ADDRESS,
              tokenOut?.address || WRAPPED_MAIN_ADDRESS,
              amountOutBigNum
            )
            .call()
          return tx
        }
      } catch (e) {
        console.log('onGetAmountIn error: ', e)
        return false
      }
    },
    [swapContract, infuraContract]
  )

  const onGetAmountOut = useCallback(
    async (tokenIn, tokenOut, amountIn) => {
      try {
        const amountInBigNum = BigNumber(10 ** tokenIn.decimals)
          .times(BigNumber(amountIn))
          .toFixed(0)
        if (swapContract) {
          const tx = await swapContract.methods
            .getAmountOut(
              tokenIn?.address || WRAPPED_MAIN_ADDRESS,
              tokenOut?.address || WRAPPED_MAIN_ADDRESS,
              amountInBigNum
            )
            .call()
          return tx
        } else if (infuraContract) {
          const tx = await infuraContract.methods
            .getAmountOut(
              tokenIn?.address || WRAPPED_MAIN_ADDRESS,
              tokenOut?.address || WRAPPED_MAIN_ADDRESS,
              amountInBigNum
            )
            .call()
          return tx
        }
      } catch (e) {
        console.log('onGetAmountOut error: ', e)
        return false
      }
    },
    [swapContract, infuraContract]
  )

  const dispatchUpdateSwapTrans = useCallback((tx, payload) => {
    if (payload.status === TRANSACTION_STATUS.PENDING) {
      dispatch(addTransaction(payload))
      showToast(<TransactionStartToast />, {
        autoClose: false,
      })
    }
    dispatch(
      updateSwapTransaction({
        isPerforming: false,
        isRejected: false,
        successResult: tx,
        successEnded: false,
      })
    )
  }, [])

  const onSwap = useCallback(
    (
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      exactAmount,
      deadline,
      tempTransactionId
    ) => {
      const isUnWrap =
        fromCurrency?.address === WRAPPED_MAIN_ADDRESS && !toCurrency?.address
      const isWrap =
        toCurrency?.address === WRAPPED_MAIN_ADDRESS && !fromCurrency?.address
      const payload = {
        fromCurrency: fromCurrency.symbol,
        toCurrency: toCurrency.symbol,
        fromAmount: fromAmount,
        toAmount: toAmount,
        type: isWrap ? 'WRAP' : isUnWrap ? 'UNWRAP' : 'SWAP',
        status: TRANSACTION_STATUS.PENDING,
        startTime: tempTransactionId,
        chainId,
        tx: undefined,
      }
      try {
        const now = Math.floor(new Date().getTime() / 1000)
        const deadlineInMinutes = deadline ? parseFloat(deadline) : 20
        const amount = BigNumber(10 ** 18)
          .times(BigNumber(fromAmount))
          .toFixed(0)
        if (isWrap) {
          return WETHContract.methods
            .deposit()
            .send({ from: account, value: amount })
            .on('transactionHash', function (tx) {
              payload.tx = tx
              dispatchUpdateSwapTrans(tx, payload)
              return tx
            })
            .on('receipt', function (receipt) {
              dispatchUpdateSwapTrans(receipt.transactionHash, {
                ...payload,
                status: TRANSACTION_STATUS.SUCCESS,
              })
            })
        }
        if (isUnWrap) {
          return WETHContract.methods
            .withdraw(amount)
            .send({ from: account })
            .on('transactionHash', function (tx) {
              payload.tx = tx
              dispatchUpdateSwapTrans(tx, payload)
              return tx
            })
            .on('receipt', function (receipt) {
              dispatchUpdateSwapTrans(receipt.transactionHash, {
                ...payload,
                status: TRANSACTION_STATUS.SUCCESS,
              })
            })
        }

        if (exactAmount) {
          const fromAmountBigNum = BigNumber(10 ** fromCurrency.decimals)
            .times(BigNumber(fromAmount * (1 + tolerance / 100)))
            .toFixed(0)
          const toAmountBigNum = BigNumber(10 ** toCurrency.decimals)
            .times(BigNumber(toAmount))
            .toFixed(0)
          if (!fromCurrency?.address && toCurrency?.address) {
            return swapContract.methods
              .swapETHForExactToken(
                toCurrency.address,
                fromAmountBigNum,
                toAmountBigNum,
                account,
                now + Math.floor(deadlineInMinutes * 60)
              )
              .send({ from: account, value: fromAmountBigNum })
              .on('transactionHash', function (tx) {
                payload.tx = tx
                dispatchUpdateSwapTrans(tx, payload)
                return tx
              })
              .on('receipt', function (receipt) {
                dispatchUpdateSwapTrans(receipt.transactionHash, {
                  ...payload,
                  status: TRANSACTION_STATUS.SUCCESS,
                })
              })
          } else if (fromCurrency?.address && !toCurrency?.address) {
            return swapContract.methods
              .swapTokenForExactETH(
                fromCurrency.address,
                fromAmountBigNum,
                toAmountBigNum,
                account,
                now + Math.floor(deadlineInMinutes * 60)
              )
              .send({ from: account })
              .on('transactionHash', function (tx) {
                payload.tx = tx
                dispatchUpdateSwapTrans(tx, payload)
                return tx
              })
              .on('receipt', function (receipt) {
                dispatchUpdateSwapTrans(receipt.transactionHash, {
                  ...payload,
                  status: TRANSACTION_STATUS.SUCCESS,
                })
              })
          } else {
            return swapContract.methods
              .swapTokenForExactToken(
                fromCurrency.address,
                toCurrency.address,
                fromAmountBigNum,
                toAmountBigNum,
                account,
                now + Math.floor(deadlineInMinutes * 60)
              )
              .send({ from: account })
              .on('transactionHash', function (tx) {
                payload.tx = tx
                dispatchUpdateSwapTrans(tx, payload)
                return tx
              })
              .on('receipt', function (receipt) {
                dispatchUpdateSwapTrans(receipt.transactionHash, {
                  ...payload,
                  status: TRANSACTION_STATUS.SUCCESS,
                })
              })
          }
        }

        const fromAmountBigNum = BigNumber(10 ** fromCurrency.decimals)
          .times(BigNumber(fromAmount))
          .toFixed(0)
        const toAmountBigNum = BigNumber(10 ** toCurrency.decimals)
          .times(BigNumber(toAmount * (1 - tolerance / 100)))
          .toFixed(0)
        if (!fromCurrency?.address && toCurrency?.address) {
          return swapContract.methods
            .swapExactETHForToken(
              toCurrency.address,
              toAmountBigNum,
              account,
              now + Math.floor(deadlineInMinutes * 60)
            )
            .send({ from: account, value: fromAmountBigNum })
            .on('transactionHash', function (tx) {
              payload.tx = tx
              dispatchUpdateSwapTrans(tx, payload)
              return tx
            })
            .on('receipt', function (receipt) {
              dispatchUpdateSwapTrans(receipt.transactionHash, {
                ...payload,
                status: TRANSACTION_STATUS.SUCCESS,
              })
            })
        } else if (fromCurrency?.address && !toCurrency?.address) {
          return swapContract.methods
            .swapExactTokenForETH(
              fromCurrency?.address,
              fromAmountBigNum,
              toAmountBigNum,
              account,
              now + Math.floor(deadlineInMinutes * 60)
            )
            .send({ from: account })
            .on('transactionHash', function (tx) {
              payload.tx = tx
              dispatchUpdateSwapTrans(tx, payload)
              return tx
            })
            .on('receipt', function (receipt) {
              dispatchUpdateSwapTrans(receipt.transactionHash, {
                ...payload,
                status: TRANSACTION_STATUS.SUCCESS,
              })
            })
        } else {
          return swapContract.methods
            .swapExactTokenForToken(
              fromCurrency.address,
              toCurrency.address,
              fromAmountBigNum,
              toAmountBigNum,
              account,
              now + Math.floor(deadlineInMinutes * 60)
            )
            .send({ from: account })
            .on('transactionHash', function (tx) {
              payload.tx = tx
              dispatchUpdateSwapTrans(tx, payload)
              return tx
            })
            .on('receipt', function (receipt) {
              dispatchUpdateSwapTrans(receipt.transactionHash, {
                ...payload,
                status: TRANSACTION_STATUS.SUCCESS,
              })
            })
        }
      } catch (err) {
        dispatch(
          updateSwapTransaction({
            isPerforming: false,
            isRejected: true,
            successResult: undefined,
          })
        )
        console.log('onSwap error: ', err)
        return false
      }
    },
    [poolsContract, dispatchUpdateSwapTrans, chainId]
  )

  return { onGetAmountIn, onGetAmountOut, onSwap }
}

export default useSwapToken
