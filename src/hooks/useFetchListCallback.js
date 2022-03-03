import { useCallback } from 'react'

import getTokenList from 'monox/getTokenList'

export const useFetchListCallback = () => {
  return useCallback(async (listUrl) => {
    let tokenList
    try {
      tokenList = await getTokenList(listUrl)
    } catch (error) {
      console.debug(`Failed to get list at url ${listUrl}`, error)
    }
    return tokenList
  }, [])
}
