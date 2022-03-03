import React, { useEffect, useState, createContext } from 'react'

import { useFetchListCallback } from 'hooks/useFetchListCallback'
import { DEFAULT_LIST_OF_LISTS } from 'monox/constants'

export const TokenContext = createContext({
  allTokens: null,
  selectedTokenList: null,
  selectedTokenURL: null,
  onSelectTokenList: () => {},
})

const TokenProvider = ({ children }) => {
  const [allTokens, setAllTokens] = useState(null)
  const [selectedTokenList, setSelectedTokenList] = useState(null)
  const [selectedTokenURL, setSelectedTokenURL] = useState(null)
  const fetchTokenList = useFetchListCallback()

  useEffect(() => {
    Promise.all(
      DEFAULT_LIST_OF_LISTS.map((listURL) => fetchTokenList(listURL))
    ).then((values) => {
      let newAllTokens = null
      DEFAULT_LIST_OF_LISTS.forEach((listURL, index) => {
        newAllTokens = {
          ...newAllTokens,
          [listURL]: values[index],
        }
      })
      setAllTokens(newAllTokens)
    })
  }, [])

  const handleSelectTokenList = async (listURL) => {
    setSelectedTokenURL(listURL)
    setSelectedTokenList(allTokens[listURL])
  }

  return (
    <TokenContext.Provider
      value={{
        allTokens,
        selectedTokenList,
        selectedTokenURL,
        onSelectTokenList: handleSelectTokenList,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export default TokenProvider
