import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import Web3 from 'web3'

import { usePrismic } from 'hooks/usePrismic'
import usePoolList from 'hooks/usePoolList'
import useSymbolList from 'hooks/useSymbolList'
import useTokenMetrics from 'hooks/useTokenMetrics'
import useWallet from 'hooks/useWallet'
import config from 'monox/config'

import { getHighVolume, getBiggestGains, getAllTokenLiquidity } from 'api'

import StyledDataTable from 'components/StyledDataTable'
import {
  Liquidity,
  OneDayVolumeData,
  OneDayData,
  OneHourData,
  Price,
  TokenData,
} from 'views/Explore/columns'
import { weiToEthNum } from 'monox/constants'
import { timeDurationMap, getTokenMetaFromAddress } from 'monox/util'

function ExploreTable({ name, filterTxt }) {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const history = useHistory()
  const [data, setData] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [oneDayChangeData, setOneDayChangeData] = useState({})
  const [oneHourChangeData, setOneHourChangeData] = useState({})
  const [recentlyAddedData, setRecentlyAddedData] = useState({})
  const [highVolumeData, setHighVolumeData] = useState({})
  const [liquidityData, setLiquidityAmount] = useState({})
  const { allTokenMetrics, loading } = useTokenMetrics(name)
  const { totalSymbolList } = useSymbolList()
  const { tokens, tokensLoading } = usePrismic(true)
  const { poolList, loading: poolLoading } = usePoolList()

  const MONOData = config[networkId || chainId].MONO
  const vUSDData = config[networkId || chainId].vUSD
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const getTokenMeta = (address) => {
    if (getTokenMetaFromAddress(address))
      return getTokenMetaFromAddress(address)
    else if (address === vUSDData?.address) return vUSDData
    else if (address === MONOData?.address) return MONOData
  }
  const arrayToObject = (array) =>
    array?.reduce((obj, item) => {
      obj[item?.token] = item
      return obj
    }, {})

  const SymbolData = arrayToObject(totalSymbolList)
  useEffect(() => {
    setData([])
    setDataLoading(true)
  }, [name])

  useEffect(() => {
    if (allTokenMetrics.length > 0 && name === 'recently-added') {
      setRecentlyAddedData(arrayToObject(allTokenMetrics))
    }
  }, [allTokenMetrics])

  useEffect(() => {
    if (poolLoading) return
    const now = dayjs()
    const selected = timeDurationMap['24H']
    const start = now.subtract(selected.interval, selected.unit).unix()
    const oneDayBiggestGains = getBiggestGains(chainId, 'all', '24H')
    const oneHourBiggestGains = getBiggestGains(chainId, 'all', '1H')
    const highVolume = getHighVolume(chainId, start)
    const liquidityAmount = getAllTokenLiquidity(chainId)

    setDataLoading(true)
    Promise.all([
      oneDayBiggestGains,
      oneHourBiggestGains,
      highVolume,
      liquidityAmount,
    ])
      .then((values) => {
        if (values?.[0]?.response?.length) {
          let oneDayMovers = {}
          values[0].response.map((value) => (oneDayMovers[value.token] = value))
          setOneDayChangeData(oneDayMovers)
        }
        if (values?.[1]?.response?.length) {
          let oneHourMovers = {}
          values[1].response.map(
            (value) => (oneHourMovers[value.token] = value)
          )
          setOneHourChangeData(oneHourMovers)
        }
        if (values?.[2]?.response?.length) {
          let volumes = {}
          values[2].response.map((value) => (volumes[value.token] = value))
          setHighVolumeData(volumes)
        }
        if (values?.[3]?.response.length) {
          let liquidity = {}
          values[3].response.map((value) => (liquidity[value.token] = value))
          setLiquidityAmount(liquidity)
        }
      })
      .catch((error) => {
        setDataLoading(false)
        console.error(error.message)
      })
  }, [poolLoading])

  useEffect(() => {
    const poolListData = {}
    poolList.map((token) => {
      const prismicData = tokens?.[token.token]
      if (SymbolData[token?.token]?.token_symbol) {
        poolListData[token.token] = {
          ...token,
          ...prismicData,
          ...recentlyAddedData[token.token],
          ...highVolumeData[token.token?.toLowerCase()],
          oneDay: oneDayChangeData[token?.token]?.price_change,
          oneHour: oneHourChangeData[token?.token]?.price_change,
          name: SymbolData[token?.token]?.token_name,
          symbol: SymbolData[token?.token]?.token_symbol,
          liquidity: liquidityData[token?.token]?.liquidity_amount_volume,
        }
      }
    })
    const tempData = allTokenMetrics.flatMap((token) => {
      const isValidAddress = Web3.utils.isAddress(token?.token)
      if (isValidAddress) {
        return (
          (poolListData[token?.token] ||
            poolListData[Web3.utils.toChecksumAddress(token?.token)]) ??
          []
        )
      }
    })
    const dataFiltered = tempData?.filter((item) => !!item)
    setData(dataFiltered)
    setDataLoading(false)
  }, [
    oneDayChangeData,
    oneHourChangeData,
    highVolumeData,
    liquidityData,
    recentlyAddedData,
    tokens,
    allTokenMetrics,
  ])

  const filteredData = useMemo(() => {
    return data.filter((tData) =>
      tData.name.toLowerCase().includes(filterTxt.toLowerCase())
    )
  }, [data, filterTxt])

  const handleAnalytics = (address) => {
    history.push({
      pathname: `/analytics/${address}?network=${networkName}`,
    })
  }
  const customSort = (valueA, valueB) => {
    if (valueA > valueB) return -1
    if (valueB > valueA) return 1
    return 0
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Token',
        accessor: 'token_name',
        style: { width: '20%' },
        sortType: (rowA, rowB) =>
          customSort(rowA?.original?.name, rowB?.original?.name),
        Cell: function tokenRow({ row }) {
          const { image, name, symbol, token } = row.original
          const tokenData = getTokenMeta(token)
          return (
            <TokenData
              image={image?.url ? image : tokenData?.logoURI}
              name={name}
              symbol={symbol}
              token={token}
              handleAnalytics={handleAnalytics}
            />
          )
        },
      },
      {
        Header: 'Price',
        accessor: 'price',
        sortType: (rowA, rowB) => {
          const PriceA = weiToEthNum(BigNumber(rowA?.original?.price))
          const PriceB = weiToEthNum(BigNumber(rowB?.original?.price))
          return customSort(PriceA, PriceB)
        },
        style: { width: '13%' },
        Cell: function priceRow({ row }) {
          const { price, token } = row.original
          return <Price price={weiToEthNum(BigNumber(price))} token={token} />
        },
      },
      {
        Header: '1h %',
        accessor: '1h %',
        style: { width: '8%' },
        sortType: (rowA, rowB) => {
          return customSort(
            Number(rowA?.original?.oneHour),
            Number(rowB?.original?.oneHour)
          )
        },
        Cell: function dayRow({ row }) {
          const { oneHour } = row.original
          return <OneHourData oneHour={oneHour} />
        },
      },
      {
        Header: '24h %',
        accessor: '24h %',
        style: { width: '11%' },
        sortType: (rowA, rowB) => {
          return customSort(
            Number(rowA?.original?.oneDay),
            Number(rowB?.original?.oneDay)
          )
        },
        Cell: function dayRow({ row }) {
          const { oneDay } = row.original
          return <OneDayData oneDay={oneDay} />
        },
      },
      {
        Header: 'Total Value Locked',
        accessor: 'Total Value Locked',
        style: { width: '14%' },
        sortType: (rowA, rowB) => {
          const liquidityA = weiToEthNum(
            BigNumber(rowA?.original?.liquidity || 0)
          )
          const liquidityB = weiToEthNum(
            BigNumber(rowB?.original?.liquidity || 0)
          )
          return customSort(liquidityA, liquidityB)
        },
        Cell: function LiquidityRow({ row }) {
          const { liquidity } = row.original
          return <Liquidity liquidity={weiToEthNum(BigNumber(liquidity))} />
        },
      },
      {
        Header: 'Volume(24h)',
        accessor: 'Volume(24h)',
        style: { width: '11%' },
        sortType: (rowA, rowB) => {
          const volumesA =
            weiToEthNum(BigNumber(rowA?.original?.volumeout)) +
            weiToEthNum(BigNumber(rowA?.original?.volumein))
          const volumesB =
            weiToEthNum(BigNumber(rowB?.original?.volumeout)) +
            weiToEthNum(BigNumber(rowB?.original?.volumein))
          return customSort(volumesA, volumesB)
        },
        Cell: function volumeRow({ row }) {
          const { volumein, volumeout, token } = row.original
          let volumes =
            weiToEthNum(BigNumber(volumeout)) + weiToEthNum(BigNumber(volumein))
          return (
            <OneDayVolumeData
              handleAnalytics={handleAnalytics}
              volumes={volumes}
              token={token}
            />
          )
        },
      },
      // {
      //   Header: 'Last 7 days',
      //   accessor: 'Last 7 days',
      //   style: { width: '11%' },
      //   Cell: function ChartRow({ row }) {
      //     const { token, pid } = row.original
      //     return (
      //       <OneDayChartData
      //         pid={pid}
      //         handleAnalytics={handleAnalytics}
      //         token={token}
      //       />
      //     )
      //   },
      // },
    ],
    []
  )
  return (
    <StyledDataTable
      columns={columns}
      data={filteredData}
      full
      justify="center"
      pagination
      striped={false}
      hoverable
      name={name}
      loading={loading || tokensLoading || dataLoading || poolLoading}
      sortOptions={{
        sortBy: [
          {
            id: 'token_name',
            desc: false,
          },
        ],
      }}
    />
  )
}

export default ExploreTable
