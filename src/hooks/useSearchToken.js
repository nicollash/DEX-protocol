import { useCallback, useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { matchSorter } from 'match-sorter'
import uniqBy from 'lodash/uniqBy'

import useWallet from 'hooks/useWallet'
import { AccountContext } from 'contexts/AccountProvider'
import uniswapTokens from 'monox/uniswap_all_tokens_list'
import { isAddress } from 'monox/constants'
import config from 'monox/config'

const useSearchToken = (filterByChainId = true, tokensListWithStatus = []) => {
  const { getToken } = useContext(AccountContext)
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const MONOData = config[networkId || chainId].MONO
  const vUSDData = config[networkId || chainId].vUSD

  const MAIN_CURRENCY = config[networkId || chainId].MAIN_CURRENCY
  const tokenList = useMemo(() => uniqBy(uniswapTokens.tokens, 'address'), [])
  const filteredTokenList = useMemo(
    () =>
      uniqBy(
        uniswapTokens.tokens.filter(
          (t) => t.chainId === (chainId || networkId)
        ),
        'address'
      ),
    [chainId || networkId]
  )
  const tokens = useSelector(({ user }) => user.tokens)

  const currentChainTokens = tokens[chainId] ?? {}

  const filteredTokens = useMemo(
    () => (filterByChainId ? filteredTokenList : tokenList),
    [filterByChainId]
  )

  const onGetToken = useCallback(
    async (address, onlySearchTokenList) => {
      const isAddressSearch = isAddress(address)
      const userTokens = Object.values(currentChainTokens)
      const data = tokensListWithStatus.length
        ? tokensListWithStatus
        : [
            ...(onlySearchTokenList ? tokenList : filteredTokens),
            ...userTokens,
            MAIN_CURRENCY,
            vUSDData,
            MONOData,
          ]
      const keys = isAddressSearch
        ? ['address', 'symbol', 'name']
        : ['symbol', 'name']
      const existedData = matchSorter(data, address, {
        keys,
      })

      if (existedData && existedData.length > 0) {
        return uniqBy(existedData, 'address')
      }
      if (onlySearchTokenList) {
        return []
      }

      try {
        if (!isAddressSearch) return []
        const searchedToken = await getToken(address)
        if (searchedToken) {
          const fromList = [...filteredTokenList, vUSDData, MONOData].find(
            (token) => token.address === address
          )
          if (fromList) {
            return []
          }
          const searchedTokenName = await searchedToken.methods.name().call()
          const searchedTokenSymbol = await searchedToken.methods
            .symbol()
            .call()
          const searchedTokenDecimals = await searchedToken.methods
            .decimals()
            .call()
          return [
            {
              name: searchedTokenName,
              symbol: searchedTokenSymbol,
              decimals: searchedTokenDecimals,
              address: searchedToken?._address,
              notInList: true,
              status: 1,
              chainId: chainId || networkId,
              showWarning: true,
            },
          ]
        }
        return []
      } catch (err) {
        console.log('onGetToken error: ', err)
        return []
      }
    },
    [getToken, tokensListWithStatus]
  )

  return {
    onGetToken,
    filteredTokenList: [...filteredTokenList, vUSDData, MONOData],
  }
}

export default useSearchToken
