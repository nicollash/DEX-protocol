import Web3 from 'web3'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PrivateKeyProvider from 'truffle-privatekey-provider'
import styled from 'styled-components'

import Modal from 'components/Modal'
import { Row, RowBetween, RowFixed } from 'components/Row'
import Label from 'components/Label'
import { CloseIcon } from 'components/IconButton'
import Divider from 'components/Divider'
import Spacer from 'components/Spacer'

import config from 'monox/config'

import { changeNetwork } from 'state/network/actions'
import { savePrivateKey } from 'state/users/actions'
import { saveProvider } from 'state/provider/actions'
import { networks } from 'monox/constants'

import useWallet from 'hooks/useWallet'

import ethereum1 from 'assets/img/Ethereum.svg'
import polygon from 'assets/img/Polygon.svg'
import mumbai from 'assets/img/mumbai.png'
import kovan from 'assets/img/kovan.png'
import check from 'assets/img/check.png'

const NetworkListModal = ({ onDismiss }) => {
  const networkId = useSelector(({ network }) => network.id)
  const wallet = useSelector(({ user }) => user.wallet)
  const privateKey = useSelector(({ user }) => user.privateKey)
  const dispatch = useDispatch()
  const { connect } = useWallet()
  const history = useHistory()
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
    if (ethereum) {
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
    history.push({ search: `?network=${network?.name?.toLowerCase()}` })
  }

  const handleNetworkClick = (id) => {
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
      !!wallet && connect('injected')
    }
    onDismiss()
  }

  return (
    <Modal>
      <RowBetween style={{ alignItems: 'center' }}>
        <RowFixed>
          <Label text="Select Network" size="16px" weight="800" />
        </RowFixed>
        <RowFixed style={{ alignItems: 'center' }}>
          <RowFixed>
            <CloseIcon onClick={onDismiss} />
          </RowFixed>
        </RowFixed>
      </RowBetween>
      <Spacer size="xs" />
      <Divider />
      <Spacer size="xs" />
      <Label opacity={0.5} size={14} weight={800}>
        Mainnets
      </Label>
      <RowBetweenRes>
        <NetworkRow>
          <img src={ethereum1} alt="ethereum" style={{ height: '32px' }} />
          <Label text={`Ethereum`} size="14" weight="800" />
        </NetworkRow>
        <NetworkRow>
          <img src={polygon} alt="polygon" style={{ height: '32px' }} />
          <Label text={`Polygon`} size="14" weight="800" />
        </NetworkRow>
      </RowBetweenRes>
      <Spacer size="xs" />
      <Label opacity={0.5} size={14} weight={800}>
        Testnets
      </Label>
      <RowBetweenRes>
        <NetworkRow onClick={() => handleNetworkClick(80001)} active>
          <img src={mumbai} alt="ethmumbaiereum" />
          <Label text={`Mumbai`} size="14" weight="800" />
          {networkId == 80001 ? (
            <img className="check" src={check} alt="" />
          ) : null}
        </NetworkRow>
        <NetworkRow onClick={() => handleNetworkClick(42)} active>
          <img src={kovan} alt="kovan" />
          <Label text={`Kovan`} size="14" weight="800" />
          {networkId == 42 ? (
            <img className="check" src={check} alt="" />
          ) : null}
        </NetworkRow>
      </RowBetweenRes>
    </Modal>
  )
}

export default NetworkListModal

const RowBetweenRes = styled(RowBetween)`
  margin-top: 10px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   flex-direction:column;
   height:120px`}
`
const NetworkRow = styled(Row)`
  border-radius: 27px;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  width: 170px;
  height: 50px;
  align-items: center;
  cursor: ${(props) => props.active && 'pointer'};
  padding-left: 9px;
  background-color: ${({ theme }) => theme.color.background.main};
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  img {
    margin-right: 12px;
  }
  div {
    margin-right: 12px;
  }
  .check {
    width: 18px;
    height: 18px;
  }
`
