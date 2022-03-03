import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'

import { saveWallet } from 'state/users/actions'
import { connectorsByName } from 'monox/connectors'

const useWalletHook = () => {
  const privateKey = useSelector(({ user }) => user.privateKey)
  const connector = useSelector(({ user }) => user.wallet)
  const provider = useSelector(({ provider }) => provider.provider)
  const chainId = useSelector(({ network }) => network.id)

  const {
    chainId: web3ChainId,
    account,
    active,
    activate,
    deactivate,
    library,
  } = useWeb3React()

  const customAccount = privateKey
    ? Web3.utils.toChecksumAddress(provider?.address)
    : account
  const customStatus = privateKey ? true : active
  const customConnector = privateKey ? 'private' : connector
  const customEthereum = privateKey ? provider : library
  const customChainId = privateKey ? chainId : web3ChainId
  const dispatch = useDispatch()

  const customConnect = useCallback(
    (connectorName) => {
      if (privateKey) {
        console.log('connected')
      } else {
        const connector = connectorsByName[connectorName]
        activate(connector, undefined, true).catch((error) => {
          if (error) {
            activate(connector)
          }
        })
      }
    },
    [privateKey]
  )

  const customDisconnect = useCallback(() => {
    if (privateKey) {
      console.log('disconnected')
    } else {
      dispatch(saveWallet(null))
      return deactivate()
    }
  })

  return {
    account: customAccount,
    status: customStatus,
    ethereum: customEthereum,
    connector: customConnector,
    chainId: customChainId,
    connect: customConnect,
    disconnect: customDisconnect,
  }
}

export default useWalletHook
