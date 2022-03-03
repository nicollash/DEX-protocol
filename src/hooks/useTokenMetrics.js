import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

import { getHighVolume, getRecentlyAdded, getBiggestGains } from 'api'
import { timeDurationMap } from 'monox/util'
import useWallet from 'hooks/useWallet'

const useTokenMetrics = (name) => {
  const [allTokenMetrics, setAllTokenMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)

  const getAllTokenMetricsData = async () => {
    setLoading(true)
    const now = dayjs()
    const selected = timeDurationMap['24H']
    const start = now.subtract(selected.interval, selected.unit).unix()
    try {
      let data
      if (name === 'biggest-gains') {
        data = await getBiggestGains(chainId || networkId, 'gains', '24H')
      } else if (name === 'biggest-drops') {
        data = await getBiggestGains(chainId || networkId, 'losses', '24H')
      } else if (name === 'recently-added') {
        data = await getRecentlyAdded(chainId || networkId, start, 'ASC')
      } else if (name === 'most-active') {
        data = await getHighVolume(chainId || networkId, start)
      }
      if (data && data?.result && Array.isArray(data?.response)) {
        let tokenMetrics = data?.response
        if (name === 'biggest-gains') {
          tokenMetrics = data?.response.splice(0, 20)
        }
        setAllTokenMetrics(tokenMetrics)
      }
    } catch (err) {
      setAllTokenMetrics({})
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllTokenMetricsData()
  }, [name])

  return { allTokenMetrics, loading, getAllTokenMetricsData }
}

export default useTokenMetrics
