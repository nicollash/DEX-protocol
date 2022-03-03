import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { getAddress } from '@ethersproject/address'

import ERC20Json from 'monox/abi/ERC20.json'
import VUSDJson from 'monox/abi/IvUSD.json'
import MonoswapStakingAbi from 'monox/abi/Staking.json'
import NewSwapAbi from 'monox/abi/NewSwap.json'
import NewPoolAbi from 'monox/abi/NewPool.json'
import WETHPoolAbi from 'monox/abi/WETH.json'
import config from 'monox/config'
import ropstenTokenList from 'monox/ropsten.json'
import kovanTokenList from 'monox/kovan.json'
import allTokensList from 'monox/uniswap_all_tokens_list.json'

import MetamaskWallet from 'assets/img/wallet-icon/metamask-wallet.svg'
import CoinbaseWallet from 'assets/img/wallet-icon/coinbase-wallet.svg'
import MobileWallet from 'assets/img/wallet-icon/mobile-wallet.svg'
import kovan from 'assets/img/kovan.png'
import mumbai from 'assets/img/mumbai.png'
import MostActive from 'assets/img/most-active.png'
import BiggestGains from 'assets/img/biggest-gains.png'
import RecentAdded from 'assets/img/recently-added.png'
import BiggestDrops from 'assets/img/biggest-drops.png'

const ERC20Abi = ERC20Json.abi
const VUSDAbi = VUSDJson.abi
const StakingAbi = MonoswapStakingAbi

const networkTokenLists = {
  1: ropstenTokenList,
  3: ropstenTokenList,
  42: kovanTokenList,
}

export const EXPLORER_FILTER = {
  'recently-added': {
    image: { url: RecentAdded },
    name: 'Recently Added',
    short_description: [{ text: 'Tokens added in the past 24 hours' }],
    tableHeading: 'Recently Added (24H)',
  },
  'biggest-gains': {
    image: { url: BiggestGains },
    name: 'Biggest Gains',
    short_description: [{ text: 'Top gains in the last 24 hours' }],
    tableHeading: 'Biggest Gains (24H)',
  },
  'biggest-drops': {
    image: { url: BiggestDrops },
    name: 'Biggest Drops',
    short_description: [{ text: 'Top drops in the last 24 hours' }],
    tableHeading: 'Biggest Losses (24H)',
  },
  'most-active': {
    image: { url: MostActive },
    name: 'Most Active',
    short_description: [{ text: 'Top 100 tokens by trading volume' }],
    tableHeading: 'Most Active',
  },
}

export const DEFAULT_LIST_OF_LISTS = []

export const allTokens = allTokensList
export const lpToken = config[42].vUSD
export const monoTokenKovan = config[42].MONO
export const monoTokenMumbai = config[80001].MONO

export const allTokensDict = {}
for (let t of allTokens.tokens) {
  allTokensDict[t?.address?.toLowerCase()] = t
}

export const getVUSDToken = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(VUSDAbi, address)
  return contract
}

export const getCurrentChainId = async (provider) => {
  const web3 = new Web3(provider)
  const currentChainId = await web3.eth.getChainId()
  return currentChainId
}

export const weiToEth = (balance, decimals = 18) => {
  const displayBalance = balance
    .dividedBy(new BigNumber(10).pow(decimals))
    .toNumber()
  return Math.floor((displayBalance + Number.EPSILON) * 10000) / 10000
}

export const weiToEthNum = (balance, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const weiToEthString = (balance, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toString()
}

export const ubetToEth = weiToEth

export const getERC20Token = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(ERC20Abi, address)
  return contract
}

export const getPoolContract = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(NewPoolAbi, address)
  return contract
}

export const getSwapContract = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(NewSwapAbi, address)
  return contract
}

export const getWETHContract = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(WETHPoolAbi, address)
  return contract
}

export const getStakeContract = (provider, address) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(StakingAbi, address)
  return contract
}

export const getBalance = async (provider, currency, userAddress) => {
  if (!currency?.address && currency?.symbol) {
    const web3 = new Web3(provider)
    const balance = await web3.eth.getBalance(userAddress)
    return balance
  } else if (currency?.address) {
    const lpContract = getERC20Token(provider, currency?.address)
    try {
      const balance = await lpContract.methods.balanceOf(userAddress).call()
      return balance
    } catch (e) {
      return '0'
    }
  }
}

const ENS_NAME_REGEX = /^(([a-zA-Z0-9]+\.)+)eth(\/.*)?$/

export const parseENSAddress = (ensAddress) => {
  const match = ensAddress.match(ENS_NAME_REGEX)
  if (!match) return undefined
  return { ensName: `${match[1].toLowerCase()}eth`, ensPath: match[3] }
}

export const isAddress = (value) => {
  try {
    return getAddress(value)
  } catch (err) {
    return false
  }
}

export const SUPPORTED_WALLETS = {
  METAMASK: {
    connector: 'injected',
    name:
      window.web3 || window.ethereum
        ? 'Connect MetaMask Wallet'
        : 'Install MetaMask',
    iconName: MetamaskWallet,
    description: 'Easy-to-use browser extension.',
  },
  WALLET_CONNECT: {
    connector: 'walletconnect',
    name: 'Connect Mobile Wallet',
    iconName: MobileWallet,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    mobile: true,
  },
  WALLET_LINK: {
    connector: 'walletlink',
    name: 'Connect Coinbase Wallet',
    iconName: CoinbaseWallet,
    description: 'Use Coinbase Wallet app on mobile device',
  },
}

export const networks = {
  /*   1: {
    name: 'Ethereum',
    network: 'mainnet',
    color: '#617eea',
    image: ethereum1,
  }, */
  42: {
    name: 'Kovan',
    chainName: 'Ethereum Mainnet',
    network: 'kovan',
    color: '#6335c9',
    image: kovan,
    blockExplorer: 'https://kovan.etherscan.io/',
  },
  80001: {
    name: 'Mumbai',
    chainName: 'Mumbai',
    network: 'mumbai',
    color: '#6335c9',
    image: mumbai,
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
}
