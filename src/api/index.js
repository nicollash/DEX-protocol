import { get } from './api'
export const getNetworkName = (chainId) => {
  let network = 'kovan'
  switch (chainId) {
    case 42:
      network = 'kovan'
      break
    case 80001:
      network = 'mumbai'
      break
    default:
      break
  }
  return network
}

export async function getPoolList(chainId) {
  const network = getNetworkName(chainId)
  return get(`${network}/pools`)
}

export async function getSymbolList(chainId) {
  const network = getNetworkName(chainId)
  return get(`${network}/metadata`)
}

export async function getPool(chainId, id) {
  const network = getNetworkName(chainId)
  return get(`${network}/pools/${id}`)
}

export async function getPrices(chainId, params) {
  const network = getNetworkName(chainId)
  return get(`${network}/pools/historicals/prices?${params}`)
}

export async function getContributedPoolList(chainId, account) {
  const network = getNetworkName(chainId)
  return get(`${network}/pools/active/${account}`)
}

export async function getStakingTrans(chainId, params) {
  const network = getNetworkName(chainId)
  return get(`${network}/${params}/events`)
}

export async function getMetaData(chainId) {
  const network = getNetworkName(chainId)
  return get(`${network}/metadata`)
}

export async function getAllTokenMetrics(chainId) {
  const network = getNetworkName(chainId)
  return get(`${network}/explore/all_metrics`)
}

export async function getAllTokenEvents(chainId, pid) {
  const network = getNetworkName(chainId)
  return get(`/${network}/events/alldata${pid ? `?pid=eq.${pid}` : ''}`)
}

export async function getAddLiqudityEvents(chainId, pid) {
  const network = getNetworkName(chainId)
  return get(`/${network}/addliquidity${pid ? `?pid=eq.${pid}` : ''}`)
}

export async function getRemoveLiqudityEvents(chainId, pid) {
  const network = getNetworkName(chainId)
  return get(`/${network}/removeliquidity${pid ? `?pid=eq.${pid}` : ''}`)
}

export async function getTokenInEvents(chainId, tokenAddress) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/swap${tokenAddress ? `?tokenIn=eq.${tokenAddress}` : ''}`
  )
}

export async function getTokenOutEvents(chainId, tokenAddress) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/swap${tokenAddress ? `?tokenOut=eq.${tokenAddress}` : ''}`
  )
}

export async function getTokenSwapEvents(chainId, tokenAddress) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/swap${
      tokenAddress
        ? `?or=(tokenIn.eq.${tokenAddress},tokenOut.eq.${tokenAddress})&order=timestamp.desc`
        : ''
    }`
  )
}

export async function getSwapEvents(chainId, tokenAddressIn, tokenAddressOut) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/swap${
      tokenAddressIn && tokenAddressOut
        ? `?or=(tokenIn.eq.${tokenAddressIn},tokenOut.eq.${tokenAddressOut})`
        : ''
    }`
  )
}

export async function getVolume(chainId, tokenAddress, time, start) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/transactions/${tokenAddress}/time/${time}/start/${start}`
  )
}

export async function getLiquidity(chainId, tokenAddress, time, start) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/liquidity/${tokenAddress}/time/${time}/start/${start}`
  )
}

export async function getBiggestGains(chainId, type, time) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/price/tokens/gains_losses/${type}/percentage/time/${time}`
  )
}

export async function getPriceChanges(chainId, tokenAddress) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/price/${tokenAddress}/gainsandlosses/percentage/time/24H`
  )
}

export async function getRecentlyAdded(chainId, start, order) {
  const network = getNetworkName(chainId)
  return get(
    `/${network}/creation/date/tokens/start/${start}/ordering/${order}`
  )
}

export async function getHighVolume(chainId, start) {
  const network = getNetworkName(chainId)
  return get(`/${network}/volume/tokens/start/${start}`)
}

export async function getAnalysisData(chainId, tokenAddress, startTime) {
  const network = getNetworkName(chainId)
  return get(`/${network}/data/token/${tokenAddress}/start/${startTime}`)
}

export async function getAllTokenLiquidity(chainId) {
  const network = getNetworkName(chainId)
  return get(`/${network}/metrics`)
}

export async function getCoinById(chainId, id) {
  const network = getNetworkName(chainId)
  return get(`/${network}/tweet_coingecko/coin/ethereum/contract/${id}`)
}

export async function getTweetList(channelName, size) {
  return get(`/twitter/tweets/tweet/channel/${channelName}/size/${size}`)
}
