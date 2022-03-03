import { useEffect, useState } from 'react'
import { getStakingTrans } from 'api'
import useWallet from 'hooks/useWallet'

const useStakingTrans = (params) => {
  const { chainId } = useWallet()
  const [transList, setTransList] = useState([])
  const [loading, setLoading] = useState(false)

  const getStakingTransactions = async () => {
    setLoading(true)
    try {
      if (params) {
        const res = await getStakingTrans(chainId, params)
        if (res?.result) {
          setTransList(res?.response)
        } else {
          setTransList([])
        }
      }
    } catch (err) {
      setTransList([])
    }
    setLoading(false)
  }

  useEffect(() => {
    getStakingTransactions()
  }, [])

  return { transList, loading, getStakingTransactions }
}

export default useStakingTrans
