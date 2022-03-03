import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getSymbolList } from 'api'
import useWallet from 'hooks/useWallet'

const useSymbolList = () => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const [symbolList, setSymbolList] = useState([])
  const [totalSymbolList, setTotalSymbolList] = useState([])
  const [loading, setLoading] = useState(false)

  const getSymbolData = async () => {
    setLoading(true)
    try {
      const symbolList = await getSymbolList(networkId)
      if (symbolList?.result) {
        if (!Array.isArray(symbolList?.response)) {
          setSymbolList([])
          setTotalSymbolList([])
          return
        }
        setSymbolList(symbolList?.response)
        setTotalSymbolList(symbolList?.response)
      }
    } catch (err) {
      setTotalSymbolList([])
      setSymbolList([])
    }
    setLoading(false)
  }

  useEffect(() => {
    getSymbolData()
  }, [chainId, networkId])

  return { symbolList, loading, totalSymbolList, getSymbolData }
}

export default useSymbolList
