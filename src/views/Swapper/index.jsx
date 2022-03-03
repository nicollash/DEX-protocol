import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

import usePool from 'hooks/usePool'
import useWallet from 'hooks/useWallet'

import Page from 'components/Page'
import PriceChart from 'components/PriceChart'
import Spacer from 'components/Spacer'
import SwapperCard from 'views/Swapper/components/SwapperCard'
import ExchangeWith from 'views/Swapper/components/ExchangeWith'
import ChartPlaceholder from 'views/Swapper/components/ChartPlaceholder'
import RecentTrades from 'views/Swapper/components/RecentTrades'
import LeftColumn from 'Layout/LeftColumn'
import RightColumn from 'Layout/RightColumn'
import Summary from './components/Summary'
import TweetCard from './components/TweetCard'
import config from 'monox/config'

const Swapper = () => {
  const [toCurrency, setToCurrency] = useState(null)
  const [fromCurrency, setFromCurrency] = useState(null)
  const [isSwapped, setIsSwapped] = useState(false)
  const [isDropdown, setIsDropdown] = useState(false)
  const [isInitial, setIsInitial] = useState(true)
  const [isShowChart, setIsShowChart] = useState(true)
  const history = useHistory()
  const [price, setPrice] = useState('')
  const [toPool, setToPool] = useState(null)
  const [loading, setLoading] = useState(false)
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const VUSD_ADDRESS = config[networkId || chainId].vUSD?.address
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const networkName = config[networkId || chainId].NAME?.toLowerCase()
  const { address1, address2 } = useParams()
  const { pool: fromPoolData } = usePool(
    fromCurrency?.address || (!!fromCurrency?.symbol && WRAPPED_MAIN_ADDRESS)
  )
  const { pool: toPoolData } = usePool(
    toCurrency?.address || (!!toCurrency?.symbol && WRAPPED_MAIN_ADDRESS)
  )
  useEffect(() => {
    setToPool(toPoolData)
  }, [toPoolData])

  const handleShowChart = (currency, poolData) => {
    if (
      poolData?.pid !== '0' ||
      currency?.address === VUSD_ADDRESS ||
      parseFloat(poolData?.price) > 0
    ) {
      setIsShowChart(true)
    } else {
      setIsShowChart(false)
    }
  }

  useEffect(() => {
    if (!address1 && !address2) {
      setToCurrency(null)
      setFromCurrency(null)
    }
  }, [address1, address2])

  useEffect(() => {
    if (address1 && address2 && !isInitial) {
      history.push(`/swap/${address2}/${address1}?network=${networkName}`)
    } else {
      setIsInitial(false)
    }
  }, [isSwapped])

  useEffect(() => {
    if (isDropdown) {
      if (fromCurrency && !toCurrency) {
        history.push(
          `/swap/${
            fromCurrency?.notInList ? fromCurrency.address : fromCurrency.symbol
          }?network=${networkName}`
        )
      } else if (!fromCurrency && toCurrency) {
        history.push({
          pathname: `/swap/${
            toCurrency?.notInList ? toCurrency.address : toCurrency.symbol
          }`,
          search: `?network=${networkName}`,
          state: { setAsReceiving: true },
        })
      } else if (fromCurrency && toCurrency) {
        history.push(
          `/swap/${
            fromCurrency?.notInList ? fromCurrency.address : fromCurrency.symbol
          }/${
            toCurrency?.notInList ? toCurrency.address : toCurrency.symbol
          }?network=${networkName}`
        )
      } else {
        history.push(`/swap?network=${networkName}`)
      }
    }
  }, [fromCurrency, toCurrency, history, isDropdown])

  useEffect(() => {
    if (fromCurrency && !fromCurrency?.notInList) {
      history.push(
        `/swap/${fromCurrency?.symbol}${
          address2 ? `/${address2}` : ''
        }?network=${networkName}`
      )
    } else {
      handleShowChart(fromCurrency, fromPoolData)
    }
  }, [fromPoolData])

  useEffect(() => {
    if (address1 && address1 === address2) {
      history.replace(`/swap/${address1}`)
      return
    }

    if (
      toCurrency &&
      address2 &&
      address2?.toLowerCase() === toCurrency?.address?.toLowerCase() &&
      !toCurrency?.notInList
    ) {
      history.push(
        `/swap/${address1}/${toCurrency?.symbol}?network=${networkName}`
      )
    } else {
      handleShowChart(toCurrency, toPoolData)
    }
  }, [toPoolData])

  const handleSetToCurrency = (value) => {
    if (value?.address && value?.address === fromCurrency?.address) {
      setFromCurrency(toCurrency)
    }
    setToCurrency(value)
  }

  const handleSetFromCurrency = (value) => {
    if (value?.address && value?.address === toCurrency?.address) {
      setToCurrency(fromCurrency)
    }
    setFromCurrency(value)
  }

  return (
    <HelmetProvider>
      <Page>
        <Helmet>
          <title>Monoswap | MonoX</title>
        </Helmet>
        <LeftColumn>
          {toCurrency || fromCurrency ? (
            <PriceChart
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              fromPoolData={fromPoolData}
              toPoolData={toPoolData}
              setPrice={setPrice}
              loading={loading}
              isSwapped={isSwapped}
              setIsShowChart={setIsShowChart}
              setLoading={setLoading}
              isShowChart={isShowChart}
            />
          ) : !(toCurrency || fromCurrency) ? (
            <>
              <ChartPlaceholder text="Select your token for the price chart" />
              <Spacer />
            </>
          ) : null}
          {!(fromCurrency && toCurrency) && (
            <ExchangeWith
              setToCurrency={setToCurrency}
              fromCurrency={fromCurrency}
              setFromCurrency={setFromCurrency}
              setIsDropdown={setIsDropdown}
              toCurrency={toCurrency}
            />
          )}
          <Summary currency={toCurrency} toPool={toPool} />
          {fromCurrency && toCurrency && (
            <RecentTrades fromCurrency={fromCurrency} toCurrency={toCurrency} />
          )}
        </LeftColumn>
        <RightColumn>
          <SwapperCard
            toCurrency={toCurrency}
            setToCurrency={handleSetToCurrency}
            fromCurrency={fromCurrency}
            setFromCurrency={handleSetFromCurrency}
            isSwapped={isSwapped}
            setIsSwapped={setIsSwapped}
            isDropdown={isDropdown}
            setIsDropdown={setIsDropdown}
            fromPoolData={fromPoolData}
            toPoolData={toPoolData}
            price={price}
            loading={loading}
          />
          <Spacer />
          <TweetCard token={toCurrency} />
        </RightColumn>
      </Page>
    </HelmetProvider>
  )
}

export default Swapper
