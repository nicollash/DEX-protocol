import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import uniqBy from 'lodash/uniqBy'

import uniswapTokens from 'monox/uniswap_all_tokens_list'
import { getToken as getTokenDetails } from 'monox/util'
import config from 'monox/config'
import { AccountContext } from 'contexts/AccountProvider'

const useUrlParams = () => {
  const { currencyIdA } = useParams()
  const history = useHistory()
  const { getToken } = useContext(AccountContext)
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const vUSDData = config[networkId || chainId].vUSD
  const MONOData = config[networkId || chainId].MONO
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const [fromCurrency, setFromCurrency] = useState(null)

  const [toCurrency, setToCurrency] = useState(null)
  const tokenList = uniqBy(
    [...uniswapTokens.tokens, vUSDData, MONOData].filter(
      (t) => t.chainId === networkId
    ),
    'address'
  )

  useEffect(() => {
    const parseIda = async () => {
      if (currencyIdA) {
        let currency = getTokenDetails(currencyIdA, tokenList)
        if (!currency) {
          const ERC20Token = await getToken(currencyIdA)

          const name = await ERC20Token.methods.name().call()
          console.log(name)
        }
        setFromCurrency(currency)
      } else {
        setFromCurrency(null)
      }
    }
    parseIda()
  }, [currencyIdA, getToken, history])

  useEffect(() => {
    if (toCurrency && fromCurrency) {
      history.push(
        `/swap/${fromCurrency.symbol}/${toCurrency.symbol}?network=${networkName}`
      )
    }
  }, [fromCurrency, toCurrency, history])

  return { fromCurrency, toCurrency, setFromCurrency, setToCurrency }
}

export default useUrlParams
