import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import { getBalance } from 'monox/constants'
import { saveBalance } from 'state/users/actions'
import useWallet from 'hooks/useWallet'

const useTokenBalance = (currency) => {
  const { chainId, account, ethereum } = useWallet()
  const balances = useSelector(({ user }) => user.balances?.[chainId] ?? {})
  const balance = !currency
    ? new BigNumber(0)
    : new BigNumber(balances[currency?.address ?? account] ?? 0)
  const dispatch = useDispatch()

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, currency, account)
    const balanceBigNum = new BigNumber(balance)
    if (chainId && currency) {
      const payload = {
        chainId: chainId,
        address: currency?.address ?? account,
        amount: balanceBigNum,
      }
      dispatch(saveBalance(payload))
    }
  }, [account, ethereum, currency, chainId])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
    }
  }, [chainId, account, ethereum, currency, fetchBalance])

  return { balance, fetchBalance }
}

export default useTokenBalance
