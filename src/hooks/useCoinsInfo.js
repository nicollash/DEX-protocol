import { useState, useEffect, useRef } from 'react'
import { getCoinById, getTweetList } from 'api'
import useWallet from 'hooks/useWallet'

const useCoinsInfo = (token) => {
  const _isMounted = useRef(true)
  const [tweets, setTweets] = useState([])
  const [selectedCoinInfo, setSelectedCoinInfo] = useState()

  const { chainId } = useWallet()

  const fetchTweets = async (token, chainId) => {
    try {
      const coinInfo = await getCoinById(chainId, token?.address)
      if (_isMounted.current) {
        setSelectedCoinInfo(coinInfo)
      }
      if (coinInfo && coinInfo.links?.twitter_screen_name) {
        const tweetData = await getTweetList(
          coinInfo.links?.twitter_screen_name,
          20
        )
        if (_isMounted.current) {
          if (tweetData?.result) {
            setTweets(tweetData.response)
          } else {
            setTweets([])
          }
        }
      } else {
        setTweets([])
      }
    } catch (err) {
      if (_isMounted.current) {
        setTweets([])
      }
      console.log('err: ', err, err.response)
    }
  }

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (token?.address && chainId) {
      fetchTweets(token, chainId)
    }
  }, [token?.address, chainId])

  return { tweets, selectedCoinInfo }
}

export default useCoinsInfo
