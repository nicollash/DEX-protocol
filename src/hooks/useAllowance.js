import { useCallback, useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'

const useAllowance = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWallet()
  const { vUSDToken, poolsContract } = useContext(AccountContext)
  const SWAP_ADDRESS = useSelector(({ network }) => network.SWAP_ADDRESS)
  const fetchAllowance = useCallback(async () => {
    if (!poolsContract) return setAllowance(0)
    const allowance = await vUSDToken.methods
      .allowance(account, SWAP_ADDRESS)
      .call()

    setAllowance(new BigNumber(allowance))
  }, [account, vUSDToken])

  useEffect(() => {
    if (account && vUSDToken) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, vUSDToken])

  return allowance
}

export default useAllowance
