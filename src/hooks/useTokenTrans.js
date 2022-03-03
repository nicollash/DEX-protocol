import { useState } from 'react'
import {
  getAllTokenEvents,
  getAddLiqudityEvents,
  getRemoveLiqudityEvents,
  getTokenInEvents,
  getTokenOutEvents,
  getTokenSwapEvents,
} from 'api'
import useWallet from 'hooks/useWallet'

const useTokenTrans = (event, pool) => {
  const { chainId } = useWallet()
  const [transList, setTransList] = useState([])
  const [loading, setLoading] = useState(false)

  const getTokenTransactions = async () => {
    setLoading(true)
    try {
      if (event && pool) {
        let res
        if (event === 'all') {
          res = await getAllTokenEvents(chainId, pool?.pid)
        } else if (event === 'adds') {
          res = await getAddLiqudityEvents(chainId, pool?.pid)
        } else if (event === 'removes') {
          res = await getRemoveLiqudityEvents(chainId, pool?.pid)
        } else if (event === 'swap') {
          res = await getTokenSwapEvents(chainId, pool?.token || pool)
        } else if (event === 'swapIn') {
          res = await getTokenInEvents(chainId, pool?.token || pool)
        } else if (event === 'swapOut') {
          res = await getTokenOutEvents(chainId, pool?.token || pool)
        }
        if (res?.result) {
          if (!Array.isArray(res?.response)) {
            setTransList([])
            return
          }
          setTransList(res?.response)
          !!res?.reponse && setTransList(res?.reponse)
        } else {
          setTransList([])
        }
      }
    } catch (err) {
      setTransList([])
    }
    setLoading(false)
  }

  const getSwapEvents = async (tokenIn, tokenOut) => {
    setLoading(true)
    try {
      if (tokenIn && tokenIn) {
        const res = await getSwapEvents(chainId, tokenIn, tokenOut)
        if (res?.result) {
          setTransList(res?.response)
          !!res?.reponse && setTransList(res?.reponse)
        } else {
          setTransList(res)
        }
      }
    } catch (err) {
      setTransList([])
    }
    setLoading(false)
  }

  return { transList, loading, getTokenTransactions, getSwapEvents }
}

export default useTokenTrans
