import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import config from 'monox/config'

export const supportedChainIds = [42, 80001] // sync with config

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: supportedChainIds,
  rpc: { 42: config[42].NETWORK_URL, 80001: config[80001].NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
})

// mainnet only
export const walletlink = new WalletLinkConnector({})

export const connectorsByName = {
  injected: injected,
  walletconnect: walletconnect,
  walletlink: walletlink,
}
