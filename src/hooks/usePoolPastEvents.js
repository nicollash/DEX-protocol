import { useCallback, useContext, useState, useEffect } from 'react'
import { AccountContext } from 'contexts/AccountProvider'

const usePoolPastEvents = (event) => {
  const { poolsContract, infuraContract } = useContext(AccountContext)
  const [pastEvents, setPastEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const handlePastEvents = useCallback(async () => {
    if (poolsContract) {
      setLoading(true)
      const events = await poolsContract.getPastEvents(event, {
        fromBlock: 0,
        toBlock: 'latest',
      })
      setLoading(false)
      setPastEvents(events)
    } else if (infuraContract) {
      setLoading(true)
      const events = await infuraContract.getPastEvents(event, {
        fromBlock: 0,
        toBlock: 'latest',
      })
      setLoading(false)
      setPastEvents(events)
    }
  }, [poolsContract, infuraContract])

  useEffect(() => {
    if (poolsContract || infuraContract) {
      handlePastEvents()
    }
  }, [poolsContract, infuraContract])

  return { pastEvents, loading }
}

export default usePoolPastEvents
