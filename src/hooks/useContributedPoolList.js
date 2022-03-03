import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import uniqBy from 'lodash/uniqBy'

import useWallet from 'hooks/useWallet'
import { getContributedPoolList } from 'api'

const useContributedPoolList = (initialFetch = true) => {
  const _isMounted = useRef(true)
  const { chainId, account } = useWallet()

  const [poolList, setPoolList] = useState([])
  const [loading, setLoading] = useState(true)
  const networkId = useSelector(({ network }) => network.id)
  const wallet = useSelector(({ user }) => user.wallet)

  const getPoolData = async () => {
    setLoading(true)
    try {
      const poolList = await getContributedPoolList(chainId || networkId, account)
      if (_isMounted.current) {
        if (poolList?.result) {
          const uniqPools = uniqBy(poolList?.response, 'token')
          setPoolList(uniqPools)
        } else {
          setPoolList([])
        }
      }
    } catch (err) {
      if (_isMounted.current) {
        setPoolList([])
      }
    }
    if (_isMounted.current) {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (account) {
      initialFetch && getPoolData()
    } else if (!wallet) {
      setPoolList([])
      setLoading(false)
    }
  }, [account, chainId])

  return { poolList, loading, getPoolData }
}

export default useContributedPoolList
