import Web3 from 'web3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrivateKeyProvider from 'truffle-privatekey-provider'

import config from 'monox/config'
import { supportedChainIds } from 'monox/connectors'

import { changeNetwork } from 'state/network/actions'
import { savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'

import useWallet from 'hooks/useWallet'

export function useInactiveListener() {
  const dispatch = useDispatch()
  const { connect } = useWallet()
  const privateKey = useSelector(({ user }) => user.privateKey)

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on) {
      ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
        /* 
        dispatch(
          changeNetwork({ network: parseInt(chainId), networkDetails: config[parseInt(chainId)] })
        )
 */
      })
      const handleChainChanged = (chainId) => {
        if (config[parseInt(chainId)]) {
          dispatch(
            changeNetwork({
              network: parseInt(chainId),
              networkDetails: config[parseInt(chainId)],
            })
          )
          if (privateKey) {
            const provider = new PrivateKeyProvider(
              privateKey,
              config[parseInt(chainId)].NETWORK_URL
            )
            dispatch(
              savePrivateKey({ chainId: chainId, privateKey: privateKey })
            )
            dispatch(saveProvider(provider))
          } else {
            const index = supportedChainIds.findIndex(
              (id) => id === parseInt(chainId)
            )

            if (index === -1) {
            } else {
              const new_provider = new Web3.providers.WebsocketProvider(
                config[parseInt(chainId)].WSS_URL
              )
              dispatch(
                savePrivateKey({ chainId: chainId, privateKey: undefined })
              )
              dispatch(saveProvider(new_provider))
              connect('injected')
            }
          }
        }
      }

      ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
    return undefined
  }, [])
}
