import { useEffect, useContext, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'
import { weiToEth, weiToEthNum } from 'monox/constants'

const usePool = (ERC20TokenAddress) => {
  const _isMounted = useRef(true)
  const [pool, setPool] = useState()
  const [balance, setBalance] = useState(null)
  const [lPAmount, setLPAmount] = useState('')
  const [sharedPercent, setSharedPercent] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [pooledAmount, setPooledAmount] = useState(0)
  const [vusdOut, setVusdOut] = useState(0)
  const [vusdBalance, setVusdBalance] = useState(0)
  const networkId = useSelector(({ network }) => network.id)
  const networkSwapAddress = useSelector(({ network }) => network.SWAP_ADDRESS)
  const wallet = useSelector(({ user }) => user.wallet)

  const { account, chainId } = useWallet()
  const {
    swapContract,
    poolsContract,
    infuraContract,
    infuraPoolContract,
  } = useContext(AccountContext)

  const getPoolData = async () => {
    if (!account) return
    if (chainId !== networkId || networkSwapAddress !== swapContract?._address)
      return
    const poolData = await swapContract.methods.pools(ERC20TokenAddress).call()
    if (poolData) {
      const balance = await poolsContract.methods
        .balanceOf(account, poolData.pid)
        .call()
      const totalSupply = await poolsContract.methods
        .totalSupply(poolData.pid)
        .call()
      if (_isMounted.current) {
        setPool(poolData)
        setBalance(weiToEthNum(new BigNumber(balance)))
        setLPAmount(balance)
        setTotalSupply(weiToEth(new BigNumber(totalSupply)))
        setSharedPercent(
          (weiToEth(new BigNumber(balance)) * 100) /
            weiToEth(new BigNumber(totalSupply))
        )
        setVusdBalance(
          weiToEthNum(BigNumber(poolData?.vusdCredit - poolData?.vusdDebt))
        )
      }
      if (new BigNumber(balance) < 1) return
      const result = await swapContract.methods
        ._removeLiquidity(ERC20TokenAddress, balance, account)
        .call()
      if (_isMounted.current) {
        setPooledAmount(weiToEthNum(new BigNumber(result.tokenOut)))
        setVusdOut(weiToEth(new BigNumber(result.vusdOut)))
      }
    }
  }

  const getInfuraPoolData = async () => {
    if (wallet && chainId !== networkId) return
    const infuraPoolData = await infuraContract.methods
      .pools(ERC20TokenAddress)
      .call()
    if (infuraPoolData) {
      setPool(infuraPoolData)
      const totalSupply = await infuraPoolContract.methods
        .totalSupply(infuraPoolData?.pid)
        .call()
      setTotalSupply(weiToEth(new BigNumber(totalSupply)))
    }
  }

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (poolsContract && ERC20TokenAddress) {
      getPoolData()
    } else if (!poolsContract && infuraContract && ERC20TokenAddress) {
      getInfuraPoolData()
    }
  }, [poolsContract, infuraContract, ERC20TokenAddress, account, networkId])

  return {
    pool,
    balance,
    lPAmount,
    sharedPercent,
    totalSupply,
    pooledAmount,
    vusdOut,
    vusdBalance,
  }
}

export default usePool
