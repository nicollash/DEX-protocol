import { useEffect, useState } from 'react'
import keyBy from 'lodash/keyBy'

import { getMetaData } from 'api'
import useWallet from 'hooks/useWallet'

const useMetaData = () => {
  const { chainId } = useWallet()
  const [metaData, setMetaData] = useState([])
  const [loading, setLoading] = useState(false)
  const [metaDataDict, setMetaDataDict] = useState({})

  const getMeta = async () => {
    setLoading(true)
    try {
      const metaList = await getMetaData(chainId)
      setMetaData(metaList?.response || [])
      setMetaDataDict(keyBy(metaList?.response, 'token'))
    } catch (err) {
      setMetaData([])
    }
    setLoading(false)
  }

  useEffect(() => {
    getMeta()
  }, [])

  return { loading, metaData, metaDataDict }
}

export default useMetaData
