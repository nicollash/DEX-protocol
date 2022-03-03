import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { getPoolList } from 'api'
import { weiToEthNum } from 'monox/constants'
import useWallet from 'hooks/useWallet'

const usePoolList = () => {
  const networkId = useSelector(({ network }) => network.id)
  const wallet = useSelector(({ user }) => user.wallet)
  const [poolList, setPoolList] = useState([])
  const [totalPoolList, setTotalPoolList] = useState([])
  const [loading, setLoading] = useState(true)
  const { chainId } = useWallet()

  const getPoolData = async () => {
    setLoading(true)
    try {
      const poolList = await getPoolList(chainId || networkId)
      setTotalPoolList(poolList?.response || [])
      const poolData = poolList?.response?.filter(
        (item) => weiToEthNum(BigNumber(item.tokenBalance)) > 0
      )
      setPoolList(poolData || [])
    } catch (err) {
      setPoolList([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!chainId && wallet) return
    getPoolData()
  }, [chainId])

  return { poolList, loading, totalPoolList, getPoolData }
}

export default usePoolList
