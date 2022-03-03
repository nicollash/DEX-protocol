import Web3 from 'web3'
import React, { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import capitalize from 'lodash/capitalize'
import Spinner from 'react-svg-spinner'
import PrivateKeyProvider from 'truffle-privatekey-provider'

import useModal from 'hooks/useModal'
import useWallet from 'hooks/useWallet'
import { TRANSACTION_STATUS } from 'monox/util'
import { networks } from 'monox/constants'
import { changeNetwork } from 'state/network/actions'
import { savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'

import config from 'monox/config'

import Button from 'components/Button'
import AccountModal from 'components/TopBar/components/AccountModal'
import WalletListModal from 'components/WalletListModal'
import NetworkListModal from 'components/NetworkListModal'
import Label from 'components/Label'

import logo from 'assets/img/account_logo.png'

const useQuery = (history) => {
  return new URLSearchParams(history?.location?.search)
}

const AccountButton = () => {
  const [handleUnlockClick] = useModal(<WalletListModal />)
  const [handleNetworkClick] = useModal(<NetworkListModal />)
  const name = useSelector(({ network }) => network.NAME)
  const wallet = useSelector(({ user }) => user.wallet)
  const privateKey = useSelector(({ user }) => user.privateKey)
  const networkId = useSelector(({ network }) => network.id)
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const history = useHistory()
  const query = useQuery(history)
  const dispatch = useDispatch()
  const [onPresentAccountModal] = useModal(<AccountModal history={history} />)
  const networkQuery = query.get('network')
  const networksArray = Object.keys(networks).map((key) =>
    Object.assign(networks[key], { chainId: parseInt(key) })
  )
  const { account, connect } = useWallet()

  const transactionsData = useSelector(({ transactions }) => transactions)
  const transactions = transactionsData[networkId] ?? []

  const pendingTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.status === TRANSACTION_STATUS.PENDING)
  }, [transactions])

  let { ethereum } = window

  const switchChain = async (chainId) => {
    const hexChainId = '0x' + Number(chainId).toString(16)
    const network = networks[chainId]
    const data = [
      {
        chainId: hexChainId,
        chainName: network.name,
        nativeCurrency: {
          name: config[chainId].MAIN_CURRENCY.name,
          symbol: config[chainId].MAIN_CURRENCY.symbol,
          decimals: 18,
        },
        rpcUrls: [config[chainId].NETWORK_URL],
        blockExplorerUrls: [network.blockExplorer],
      },
    ]

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      })
      window.location.reload()
    } catch (switchErr) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: data,
        })
        window.location.reload()
      } catch (addError) {}
    }
  }

  const handleNetworkChange = (id) => {
    dispatch(changeNetwork({ network: id, networkDetails: config[id] }))
    if (id !== networkId) {
      switchChain(id)
    }
    if (privateKey) {
      const provider = new PrivateKeyProvider(
        privateKey,
        config[id].NETWORK_URL
      )
      dispatch(savePrivateKey({ id: id, privateKey: privateKey }))
      dispatch(saveProvider(provider))
    } else {
      const new_provider = new Web3.providers.WebsocketProvider(
        config[id].WSS_URL
      )
      dispatch(savePrivateKey({ id: id, privateKey: undefined }))
      dispatch(saveProvider(new_provider))
      !!wallet && connect(wallet)
    }
  }

  useEffect(() => {
    if (networkQuery) {
      const networkFromQuery = networksArray.find(
        (network) => network?.network.toLowerCase() === networkQuery
      )
      if (
        networkFromQuery &&
        networkFromQuery?.chainId !== networkId &&
        networkFromQuery?.chainId !== 1
      ) {
        handleNetworkChange(networkFromQuery?.chainId)
      }
    }
  }, [networkQuery])

  useEffect(() => {
    if (networkName) {
      setTimeout(() => {
        history.push({ search: `?network=${networkName}` })
      }, 600)
    }
  }, [networkName])
  return (
    <Div>
      <NetworkButton onClick={handleNetworkClick}>
        <img
          src={networks?.[networkId]?.image}
          height="23"
          width="23"
          alt="Network Button"
        />
        <Label
          text={capitalize(name)}
          weight="800"
          size="13"
          color={networks?.[networkId]?.color}
          style={{ marginLeft: '8px', marginTop: '2px' }}
        />
      </NetworkButton>
      <StyledAccountButton>
        {!account ? (
          <Button onClick={handleUnlockClick} size="sm" text="Connect Wallet" />
        ) : pendingTransactions.length > 0 ? (
          <ButtonPending onClick={onPresentAccountModal} size="sm">
            {pendingTransactions.length} Pending <Spinner color="#ffffff" />
          </ButtonPending>
        ) : (
          <Button onClick={onPresentAccountModal} size="sm">
            <img
              src={logo}
              style={{ margin: '0 5px 2px 0', width: '20px' }}
              alt=""
            />
            {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
          </Button>
        )}
      </StyledAccountButton>
    </Div>
  )
}

const Div = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const StyledAccountButton = styled.div`
  button {
    height: 31px;
  }
`

const ButtonPending = styled.button`
  width: 140px;
  height: 31px;
  border-radius: 4px;
  background-color: #abb1c5;
  box-shadow: 0 5px 20px 0 #d1d9e6, -18px -18px 30px 0 rgba(255, 255, 255, 0.5);
  border: unset;
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    margin-left: 5px;
  }
`

const NetworkButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px 4px 4px;
  border-radius: 15.5px;
  background-color: rgba(97, 126, 234, 0.15);
  margin-right: 15px;
  cursor: pointer;
`

export default AccountButton
