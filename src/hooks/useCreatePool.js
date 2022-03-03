import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'

import { AccountContext } from 'contexts/AccountProvider'
import { addTransaction as reduxAddTransaction } from 'state/transaction/actions'
import { showToast, TRANSACTION_STATUS } from 'monox/util'

import { TransactionStartToast } from 'components/ToastPopup'
import useWallet from 'hooks/useWallet'

const useCreatePool = () => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const { poolsContract, swapContract } = useContext(AccountContext)

  const handleCreatePool = useCallback(
    async (currency, amount, price, payload) => {
      try {
        const priceBigNum = BigNumber(10 ** (18 + (18 - currency?.decimals)))
          .times(BigNumber(price))
          .toFixed(0)
        const amountBigNum = BigNumber(10 ** currency?.decimals)
          .times(BigNumber(amount))
          .toFixed(0)
        return swapContract.methods
          .listNewToken(
            currency?.address,
            priceBigNum,
            0,
            amountBigNum,
            account
          )
          .send({ from: account })
          .on('transactionHash', function (tx) {
            showToast(<TransactionStartToast />, {
              autoClose: false,
              id: currency,
            })
            dispatch(
              reduxAddTransaction({
                ...payload,
                status: TRANSACTION_STATUS.PENDING,
                tx,
              })
            )
            return tx
          })
      } catch (e) {
        console.log('error: ', e)
        return false
      }
    },
    [poolsContract, account]
  )

  return { onCreatePool: handleCreatePool }
}

export default useCreatePool
