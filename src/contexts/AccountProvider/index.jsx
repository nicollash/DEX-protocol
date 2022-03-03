import React, { createContext, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Web3 from 'web3'
import PrivateKeyProvider from 'truffle-privatekey-provider'

import { savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'

import {
  getPoolContract,
  getStakeContract,
  getSwapContract,
  getERC20Token,
  getVUSDToken,
  getWETHContract,
} from 'monox/constants'

import useWallet from 'hooks/useWallet'
import { useInactiveListener } from 'hooks/web3'

export const AccountContext = createContext({
  poolsContract: null,
  swapContract: null,
  stakeContract: null,
  infuraContract: null,
  infuraStakeContract: null,
  vUSDToken: null,
  tokenList: null,
  connect: () => {},
})

const AccountProvider = ({ children }) => {
  const { ethereum, account, status, connect, chainId } = useWallet()
  const SWAP_ADDRESS = useSelector(({ network }) => network.SWAP_ADDRESS)
  const STAKING_ADDRESS = useSelector(({ network }) => network.STAKING_ADDRESS)
  const POOL_ADDRESS = useSelector(({ network }) => network.POOL_ADDRESS)
  const VUSD_ADDRESS = useSelector(({ network }) => network.vUSD)?.address
  const NETWORK_URL = useSelector(({ network }) => network.NETWORK_URL)
  const WSS_URL = useSelector(({ network }) => network.WSS_URL)

  const [poolsContract, setPoolsContract] = useState(null)
  const [swapContract, setSwapContract] = useState(null)
  const [stakeContract, setStakeContract] = useState(null)
  const [infuraContract, setInfuraContract] = useState(null)
  const [monoXContract, setMonoXContract] = useState(null)
  const [infuraPoolContract, setInfuraPoolContract] = useState(null)
  const [infuraStakeContract, setInfuraStakeContract] = useState(null)
  const [vUSDToken, setVUSDToken] = useState(null)
  const [WETH_Address, setWETHAddress] = useState(null)
  const [WETHContract, setWETHContract] = useState(null)

  const dispatch = useDispatch()
  const wallet = useSelector(({ user }) => user.wallet)
  const privateKey = useSelector(({ user }) => user.privateKey)
  const provider = useSelector(({ provider }) => provider.provider)
  const networkId = useSelector(({ network }) => network.id)

  useInactiveListener()

  useEffect(() => {
    if (!privateKey) {
      const new_provider = new Web3.providers.WebsocketProvider(WSS_URL)
      dispatch(savePrivateKey({ chainId: chainId, privateKey: undefined }))
      dispatch(saveProvider(new_provider))
    } else {
      const new_provider = new PrivateKeyProvider(privateKey, NETWORK_URL)
      dispatch(saveProvider(new_provider))
    }
  }, [dispatch, chainId || networkId])

  useEffect(() => {
    provider && loadInfuraAccount()
  }, [provider])

  useEffect(() => {
    if (!infuraContract) {
      loadInfuraAccount()
    }
  }, [infuraContract])

  useEffect(() => {
    window.addEventListener('load', connectToAccount)

    return () => {
      window.removeEventListener('load', connectToAccount)
    }
  }, [wallet])

  useEffect(() => {
    if (status) {
      loadAccount()
    }
  }, [status, provider])

  const connectToAccount = () => {
    if (!status && wallet) {
      connect(wallet)
    }
  }

  const loadAccount = async () => {
    if (chainId !== networkId) return
    if (ethereum) {
      const poolsContract = getPoolContract(ethereum, POOL_ADDRESS)
      const swapContract = getSwapContract(ethereum, SWAP_ADDRESS)
      const stakeContract = getStakeContract(ethereum, STAKING_ADDRESS)
      const vUSDToken = getVUSDToken(ethereum, VUSD_ADDRESS)
      setPoolsContract(poolsContract)
      setStakeContract(stakeContract)
      setSwapContract(swapContract)
      setVUSDToken(vUSDToken)
      const monoXPool = await swapContract.methods.monoXPool().call()
      const monoXPoolContract = getPoolContract(ethereum, monoXPool)
      setMonoXContract(monoXPoolContract)
      const WETH_ADDRESS = await monoXPoolContract.methods.getWETHAddr().call()
      setWETHAddress(WETH_ADDRESS)
      const WETHContract = getWETHContract(ethereum, WETH_ADDRESS)
      setWETHContract(WETHContract)
    }
  }

  const loadInfuraAccount = async () => {
    if (provider) {
      const swapContract = getSwapContract(provider, SWAP_ADDRESS)
      const poolContract = getPoolContract(provider, POOL_ADDRESS)
      const stakeContract = getStakeContract(provider, STAKING_ADDRESS)
      setInfuraContract(swapContract)
      setSwapContract(swapContract)
      setInfuraPoolContract(poolContract)
      setInfuraStakeContract(stakeContract)
      if (poolContract) {
        setMonoXContract(poolContract)
      }
    }
  }

  const getAllowance = async (ERC20TokenAddress, isSwap) => {
    if (!ethereum) return
    const ERC20Token = getERC20Token(ethereum, ERC20TokenAddress)
    const allowance = await ERC20Token.methods
      .allowance(account, isSwap ? SWAP_ADDRESS : POOL_ADDRESS)
      .call()
    return allowance
  }

  const getToken = useCallback(
    async (ERC20TokenAddress) => {
      if (ethereum) {
        return getERC20Token(ethereum, ERC20TokenAddress)
      } else if (!wallet) {
        const provider = new Web3.providers.WebsocketProvider(WSS_URL)
        return getERC20Token(provider, ERC20TokenAddress)
      }
    },
    [ethereum, WSS_URL, wallet]
  )

  return (
    <AccountContext.Provider
      value={{
        poolsContract,
        swapContract,
        stakeContract,
        monoXContract,
        infuraContract,
        infuraPoolContract,
        infuraStakeContract,
        vUSDToken,
        WETH_Address,
        WETHContract,
        loadAccount,
        getAllowance,
        getToken,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export default AccountProvider
