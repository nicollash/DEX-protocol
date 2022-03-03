import React from 'react'
import { toast } from 'react-toastify'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'

import { weiToEth, allTokensDict } from 'monox/constants'
import StyledToast from 'components/StyledToast'

import { uriToHttp } from 'monox/getTokenList'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
const userTimezone = dayjs.tz.guess()

export const getTokenMetaFromAddress = (address) => {
  if (address) return allTokensDict[address.toLowerCase()]
  else return {}
}

export const getPoolTokenSymbol = (pool) =>
  getTokenMetaFromAddress(pool.token).symbol

export const getPoolRewardText = (pool) =>
  `${weiToEth(BigNumber(pool.reward))} ${getPoolTokenSymbol(pool)}`

export const getPoolTokenLogoURL = (pool) => {
  const token = getTokenMetaFromAddress(pool.token)
  return token ? uriToHttp(token.logoURI)[0] : null
}

export const getTokenEtherFromWeiByAddress = (token, amount) =>
  BigNumber(10 ** token.decimals)
    .times(BigNumber(amount))
    .toFixed(0)

export const isUnnamed = (pool) =>
  pool && (pool.name === 'undefined' || pool.name === '')

export const timeDurationMap = {
  '24H': {
    difference: 30,
    unit: 'day',
    format: 'hh:mm A z',
    graphFormat: 'hh:mm',
    displayText: 'Past 24 Hour',
    interval: 1,
  },
  '1W': {
    difference: 120,
    unit: 'week',
    format: 'hh:mm A MMM D z',
    graphFormat: 'MMM D',
    displayText: 'Past Week',
    interval: 1,
  },
}

function getRandomInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.random() * (max - min + 1) + min
}

export const generateChartData = (range) => {
  const min = 1200
  const max = 1300
  const basePrice = getRandomInclusive(1000, 1300)

  const now = dayjs()

  const selected = timeDurationMap[range]
  const end = now.subtract(1, selected.unit)
  const data = []
  let start = now.subtract(selected.difference, 'seconds')
  while (start.isAfter(end.toDate())) {
    data.push({
      x: start.unix() * 1000,
      y: getRandomInclusive(min, max),
      '24H': start.tz(userTimezone).format(timeDurationMap['24H'].format),
      '1W': start.tz(userTimezone).format(timeDurationMap['1W'].format),
      '1M': start.tz(userTimezone).format(timeDurationMap['1M'].format),
    })
    start = start.subtract(selected.difference, 'minutes')
  }
  return { data: data.reverse(), basePrice: basePrice }
}

export function setTokenValue(symbol, tokenList) {
  let token
  if (symbol && symbol.startsWith('0x')) {
    token = tokenList.filter(
      (list) => list.address.toLowerCase() === symbol.toLowerCase()
    )
  } else {
    token = tokenList.filter((list) => list.symbol === symbol)
  }
  return token.length ? token[0] : 'Choose Token'
}

export const getToken = (symbol, tokenList) => {
  let token
  if (symbol && symbol.startsWith('0x')) {
    token = tokenList.find(
      (list) => list?.address?.toLowerCase() === symbol.toLowerCase()
    )
  } else {
    token = tokenList.find((list) => list.symbol === symbol)
  }
  return token
}

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
}

export function getEtherscanLink(chainId, data, type) {
  let prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
  }etherscan.io`

  if (chainId === 80001) {
    prefix = `https://mumbai.polygonscan.com`
  }

  if (chainId === 137) {
    prefix = `https://polygonscan.com`
  }

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function precise(value, digit) {
  if (!parseFloat(value) || !isFinite(parseFloat(value))) {
    return 0
  }
  const sign = Math.sign(parseFloat(value))
  if (parseFloat(Math.abs(value)) >= 1) {
    return (
      sign *
      parseFloat(Math.abs(value))
        .toFixed(digit)
        .match(/^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/)[1]
    )
  } else if (parseFloat(Math.abs(value)) >= 0) {
    const zeroCount = -Math.floor(
      Math.log(parseFloat(Math.abs(value))) / Math.log(10) + 1
    )
    if (zeroCount >= 17) return 0
    return (
      sign *
      parseFloat(Math.abs(value))
        .toFixed(digit + zeroCount > 18 ? 18 : digit + zeroCount)
        .match(/^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/)[1]
    )
  }
}

export function poolValue(vusdBalance, tokenBalance, price) {
  return vusdBalance + tokenBalance * price
}

export function amountLPReceive(amount, price, poolBalance, totalSupply) {
  if (totalSupply > 0) {
    return (amount * price * totalSupply) / poolBalance
  } else if (totalSupply === 0) {
    return amount * 100
  } else {
    return 0
  }
}

export const ACTIONS = {
  SWAP: 'SWAP',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  CREATE: 'CREATE',
  STAKE: 'STAKE',
  UNSTAKE: 'UNSTAKE',
  APPROVE: 'APPROVE',
  HARVEST: 'HARVEST',
  WRAP: 'WRAP',
  UNWRAP: 'UNWRAP',
}

export const TRANSACTION_STATUS = {
  FAIL: 'FAIL',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  REQUESTED: 'REQUESTED',
}

export const toEllipsis = (str, numCharsToHide = 7) => {
  if (!str) return null
  if (numCharsToHide === 0) return str
  else
    return (
      str.substr(0, str.length / 2 - numCharsToHide) +
      '...' +
      str.substr(str.length / 2 + numCharsToHide, str.length)
    )
}

export const showToast = (msg, options) => {
  toast(<StyledToast>{msg}</StyledToast>, { ...options })
}

export const VUSD_LOGO =
  'https://user-images.githubusercontent.com/57688920/112673530-e3da8980-8e75-11eb-99fc-3788ad5e8f79.png'

export const formatAmount = (x) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const tokenSymbol = (currency, WRAPPED_MAIN_ADDRESS, MAIN_CURRENCY) => {
  if (currency?.address === WRAPPED_MAIN_ADDRESS)
    return `W${MAIN_CURRENCY.symbol}`
  else return currency?.symbol
}
