import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'
import AnimatedNumber from 'react-animated-numbers'

import useWallet from 'hooks/useWallet'
import config from 'monox/config'
import { getPrices, getPriceChanges } from 'api'

import { weiToEth } from 'monox/constants'
import { timeDurationMap, precise } from 'monox/util'
import theme from 'theme'

import Label from 'components/Label'
import { RowBetween } from 'components/Row'
import Spacer from 'components/Spacer'
import ChartPlaceholder from 'views/Swapper/components/ChartPlaceholder'

const initialState = {
  data: [],
  basePrice: 0,
  timeRange: '24H',
  hoveredPoint: {},
  showPriceChange: false,
}

const labelStyle = {
  fontFamily: 'Nunito',
  fontSize: '12px',
  fontWeight: 800,
  colors: ['#acb3c6'],
}

let fromChartData = []
let toChartData = []

const chartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
      }
    case 'SET_BASE_PRICE':
      return {
        ...state,
        basePrice: action.payload,
      }
    case 'SET_TIME_RANGE': {
      return {
        ...state,
        timeRange: action.payload,
      }
    }
    case 'SET_HOVERED_POINT': {
      return {
        ...state,
        hoveredPoint: action.payload,
      }
    }
    default:
      return state
  }
}

const PriceChart = ({
  fromCurrency,
  toCurrency,
  fromPoolData,
  toPoolData,
  setPrice,
  loading,
  setLoading,
  isSwapped,
  setIsShowChart,
  isShowChart,
}) => {
  const [state, dispatch] = useReducer(chartReducer, initialState)
  const { timeRange, data, hoveredPoint } = state
  const [isFromNewToken, setIsFromNewToken] = useState(false)
  const [priceChanges, setPriceChanges] = useState([])
  const [isToNewToken, setIsToNewToken] = useState(false)

  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const VUSD_ADDRESS = config[networkId || chainId]?.vUSD?.address

  const getTokenPriceChanges = async () => {
    try {
      const priceChangeData = await getPriceChanges(
        chainId,
        fromCurrency?.address || WRAPPED_MAIN_ADDRESS
      )
      setPriceChanges(priceChangeData?.response)
    } catch (err) {
      setPriceChanges([])
    }
  }

  useEffect(() => {
    if (chainId && fromCurrency) {
      getTokenPriceChanges()
    }
  }, [chainId, fromCurrency])

  useEffect(() => {
    if (!fromCurrency) {
      toChartData = []
    } else if (!toCurrency) {
      fromChartData = []
    }
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if ((!fromCurrency && toCurrency) || (!toCurrency && fromCurrency)) {
      const temp = fromChartData
      fromChartData = toChartData
      toChartData = temp
    }
  }, [isSwapped])

  const vUSDData = {
    x: Date.now() / 1000,
    y: 1,
    '1W': dayjs.unix(Date.now() / 1000).format(timeDurationMap['1W'].format),
    '24H': dayjs.unix(Date.now() / 1000).format(timeDurationMap['24H'].format),
  }

  const getTimeParams = useCallback(() => {
    const now = dayjs()
    const selected = timeDurationMap[timeRange]
    const start = now.subtract(selected.interval, selected.unit)
    return { start: start.unix(), end: now.unix() }
  }, [timeRange])

  const handleGraph = (currency, pid, isFromCurrency) => {
    if (currency?.address !== VUSD_ADDRESS) {
      setLoading(true)
    }
    const pricefromPool = weiToEth(
      new BigNumber(isFromCurrency ? fromPoolData?.price : toPoolData?.price)
    )
    if (
      !isFromCurrency &&
      fromCurrency &&
      toCurrency &&
      pricefromPool <= 0.0001 &&
      currency?.address !== VUSD_ADDRESS
    ) {
      setIsShowChart(false)
      setLoading(true)
      return
    }
    const realTimePriceData = {
      x: Date.now() / 1000,
      y: pricefromPool,
      '1W': dayjs.unix(Date.now() / 1000).format(timeDurationMap['1W'].format),
      '24H': dayjs
        .unix(Date.now() / 1000)
        .format(timeDurationMap['24H'].format),
    }
    const timeParams = getTimeParams()
    const params = `pid=eq.${pid}&timestamp=gte.${timeParams.start}&timestamp=lte.${timeParams.end}`
    currency?.address !== VUSD_ADDRESS &&
      getPrices(chainId || networkId, params)
        .then((response) => {
          let res = response?.response || []
          if (!Array.isArray(res)) {
            setLoading(false)
            setIsShowChart(false)
            return
          }
          if (pid < 1) {
            res = res.filter((item) => item?.status !== 0 && item?.price > 0)
          }
          let bufferData = res
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((e) => {
              const timestamp = parseFloat(e.timestamp)
              return {
                x: timestamp,
                y: weiToEth(new BigNumber(e.price)),
                '1W': dayjs
                  .unix(timestamp)
                  .format(timeDurationMap['1W'].format),
                '24H': dayjs
                  .unix(timestamp)
                  .format(timeDurationMap['24H'].format),
              }
            })
          bufferData.unshift(realTimePriceData)
          if (res?.length === 0) {
            isFromCurrency && setIsFromNewToken(true)
            !isFromCurrency && setIsToNewToken(true)
            bufferData = [
              {
                x: Date.now() / 1000,
                y: pricefromPool,
                '1W': dayjs
                  .unix(Date.now() / 1000)
                  .format(timeDurationMap['1W'].format),
                '24H': dayjs
                  .unix(Date.now() / 1000)
                  .format(timeDurationMap['24H'].format),
              },
            ]
          }
          if (isFromCurrency) {
            fromChartData = bufferData
          } else {
            toChartData = bufferData
          }

          if (res?.length > 0) {
            isFromCurrency && setIsFromNewToken(false)
            !isFromCurrency && setIsToNewToken(false)
            isFromCurrency && !isToNewToken && setIsShowChart(true)
            isFromCurrency && isToNewToken && setIsShowChart(false)
            !isFromCurrency && !isFromNewToken && setIsShowChart(true)
            !isFromCurrency && isFromNewToken && setIsShowChart(false)
            const chartdata = bufferData.map((e, index) => {
              let price = e.y
              if (isFromCurrency && toCurrency?.address !== VUSD_ADDRESS) {
                const toCharDataIndex =
                  index >= toChartData.length ? toChartData.length - 1 : index
                price = e.y / (toChartData[toCharDataIndex]?.y || 1)
              } else if (
                !isFromCurrency &&
                fromCurrency?.address === VUSD_ADDRESS
              ) {
                price = 1 / e.y
              } else if (!isFromCurrency && fromCurrency?.name) {
                const fromCharDataIndex =
                  index >= fromChartData.length
                    ? fromChartData.length - 1
                    : index
                price = (fromChartData[fromCharDataIndex]?.y || 1) / e.y
              }
              return {
                x: e.x,
                y: price,
                '1W': e['1W'],
                '24H': e['24H'],
              }
            })
            let price = pricefromPool
            if (isFromCurrency && toCurrency?.address !== VUSD_ADDRESS) {
              price = pricefromPool / (toChartData[0]?.y || 1)
            } else if (
              !isFromCurrency &&
              fromCurrency?.address === VUSD_ADDRESS
            ) {
              price = 1 / pricefromPool
            } else if (!isFromCurrency && fromCurrency?.name) {
              price = (fromChartData[0]?.y || 1) / pricefromPool
            }
            const priceData = {
              x: Date.now() / 1000,
              y: price,
              '1W': dayjs
                .unix(Date.now() / 1000)
                .format(timeDurationMap['1W'].format),
              '24H': dayjs
                .unix(Date.now() / 1000)
                .format(timeDurationMap['24H'].format),
            }
            chartdata.unshift(priceData)
            dispatch({ type: 'SET_DATA', payload: chartdata })
            dispatch({
              type: 'SET_BASE_PRICE',
              payload: chartdata?.[chartdata.length - 1].y,
            })
            dispatch({
              type: 'SET_HOVERED_POINT',
              payload: { y: chartdata?.[0].y },
            })
          } else {
            setIsShowChart(false)
            if (isFromCurrency && toChartData.length > 0) {
              const chartData = toChartData.map((item) => {
                const obj = Object.assign({}, item)
                obj.y = pricefromPool / item.y
                return obj
              })
              dispatch({ type: 'SET_DATA', payload: chartData })
              dispatch({
                type: 'SET_BASE_PRICE',
                payload: chartData?.[chartData.length - 1].y,
              })
              dispatch({
                type: 'SET_HOVERED_POINT',
                payload: { y: chartData?.[0].y },
              })
            } else if (!isFromCurrency && fromChartData.length > 0) {
              const chartData = fromChartData.map((item) => {
                const obj = Object.assign({}, item)
                obj.y = item.y / pricefromPool
                return obj
              })
              dispatch({ type: 'SET_DATA', payload: chartData })
              dispatch({
                type: 'SET_BASE_PRICE',
                payload: chartData?.[chartData.length - 1].y,
              })
              dispatch({
                type: 'SET_HOVERED_POINT',
                payload: { y: chartData?.[0].y },
              })
              setLoading(false)
            } else if (
              (isFromCurrency && toChartData.length === 0) ||
              (!isFromCurrency && fromChartData.length === 0)
            ) {
              setLoading(false)
              dispatch({ type: 'SET_DATA', payload: [realTimePriceData] })
              dispatch({
                type: 'SET_BASE_PRICE',
                payload: pricefromPool,
              })
              dispatch({
                type: 'SET_HOVERED_POINT',
                payload: { y: pricefromPool },
              })
            }
          }

          setLoading(false)
        })
        .catch((error) => {
          console.error(error.message)
          setLoading(false)
          setIsShowChart(false)
        })

    if (
      isFromCurrency &&
      currency?.address === VUSD_ADDRESS &&
      toChartData.length > 0
    ) {
      const chartData = toChartData.map((item) => {
        const obj = Object.assign({}, item)
        obj.y = 1 / item.y
        return obj
      })
      dispatch({ type: 'SET_DATA', payload: chartData })
      dispatch({
        type: 'SET_BASE_PRICE',
        payload: chartData?.[chartData.length - 1].y,
      })
      dispatch({
        type: 'SET_HOVERED_POINT',
        payload: { y: chartData?.[0].y },
      })
    } else if (
      !isFromCurrency &&
      currency?.address === VUSD_ADDRESS &&
      fromChartData.length > 0
    ) {
      dispatch({ type: 'SET_DATA', payload: fromChartData })
      dispatch({
        type: 'SET_BASE_PRICE',
        payload: fromChartData?.[fromChartData.length - 1].y,
      })
      dispatch({
        type: 'SET_HOVERED_POINT',
        payload: { y: fromChartData?.[0].y },
      })
      setLoading(false)
    } else if (
      (isFromCurrency &&
        currency?.address === VUSD_ADDRESS &&
        toChartData.length === 0) ||
      (!isFromCurrency &&
        currency?.address === VUSD_ADDRESS &&
        fromChartData.length === 0)
    ) {
      setLoading(false)
      dispatch({ type: 'SET_DATA', payload: [vUSDData] })
      dispatch({
        type: 'SET_BASE_PRICE',
        payload: 1,
      })
      dispatch({
        type: 'SET_HOVERED_POINT',
        payload: { y: 1 },
      })
    }
  }

  useEffect(() => {
    if (
      fromPoolData?.pid &&
      (fromPoolData?.pid !== '0' ||
        fromCurrency?.address === VUSD_ADDRESS ||
        parseFloat(fromPoolData?.price) > 0)
    ) {
      handleGraph(fromCurrency, fromPoolData?.pid, true)
    }
  }, [timeRange, getTimeParams, fromPoolData])

  useEffect(() => {
    if (
      toPoolData?.pid &&
      (toPoolData?.pid !== '0' ||
        toCurrency?.address === VUSD_ADDRESS ||
        parseFloat(toPoolData?.price) > 0)
    ) {
      handleGraph(toCurrency, toPoolData.pid, false)
    }
  }, [timeRange, getTimeParams, toPoolData])

  useEffect(() => {
    if (!data?.length && data?.length === 0) {
      return
    }
  }, [data, timeRange])

  const closePrice = data?.length && data[0].y
  const isHovered =
    hoveredPoint && Object.keys(hoveredPoint).length ? true : false
  const currentPrice = isHovered ? hoveredPoint.y : closePrice
  const currentPriceList =
    currentPrice && currentPrice.toFixed(4).toString().split('.')
  const handleTimeRangeChange = (value) => {
    if (!isShowChart) {
      return
    }
    setLoading(true)
    dispatch({ type: 'SET_TIME_RANGE', payload: value })
  }

  useEffect(() => {
    setPrice(closePrice)
  }, [closePrice])

  useEffect(() => {
    if (data?.length === 0) {
      setIsShowChart(false)
      setLoading(true)
    } else if (data?.length > 0) {
      setIsShowChart(true)
      setLoading(false)
    }
  }, [data])

  return (
    <StyledPriceChart>
      <StyledHeading>
        <div>
          {toCurrency ? (
            <>
              {`${fromCurrency?.symbol || toCurrency.symbol} ${
                fromCurrency?.symbol ? '/' : ''
              }`}
              &nbsp;
            </>
          ) : (
            fromCurrency?.symbol
          )}
        </div>
        <Label size={18} weight="800">
          {toCurrency?.symbol && fromCurrency?.symbol ? toCurrency?.symbol : ''}
        </Label>
      </StyledHeading>
      <StyledChartContainer>
        {loading ? (
          <>
            <LoadingContainerPrice />
            <Spacer size="sm" />
            <LoadingContainerPriceSmall />
          </>
        ) : (
          <>
            <StyledPrice>
              {currentPriceList < 0.0001 ? (
                '< $0.0001'
              ) : (
                <>
                  {`${!fromCurrency?.symbol || !toCurrency?.symbol ? '$' : ''}`}
                  <AnimatedNumber
                    animateToNumber={currentPriceList[0] ?? 0}
                    animationType={'random'}
                  />
                  .
                  {String(
                    '0000'.slice(
                      parseInt(`${currentPriceList[1]}`.slice(0, 4)).toString()
                        .length
                    )
                  )}
                  <AnimatedNumber
                    animateToNumber={
                      currentPriceList[1]
                        ? `${currentPriceList[1]}0000`.slice(0, 4)
                        : '0'
                    }
                    animationType={'random'}
                  />
                </>
              )}
            </StyledPrice>{' '}
            {isShowChart && (
              <Row style={{ marginTop: '-6px' }}>
                <StyledPriceChange
                  style={{
                    color:
                      Array.isArray(priceChanges) &&
                      priceChanges[0]?.price_change < 0
                        ? 'rgb(255, 101, 109)'
                        : theme.color.font.primary,
                  }}
                >
                  $
                  {new Intl.NumberFormat().format(
                    precise(
                      priceChanges[0]?.net_price_change / 10 ** 18,
                      4 ?? 0
                    )
                  )}{' '}
                  {`(${new Intl.NumberFormat().format(
                    precise(priceChanges[0]?.price_change, 4 ?? 0)
                  )}%)`}
                  <StyledTimeDisplay>
                    {timeDurationMap[timeRange]?.displayText}s
                  </StyledTimeDisplay>
                </StyledPriceChange>
                <div className="timeSelector" style={{ marginRight: '77px' }}>
                  <StyledTimeRange>
                    {Object.keys(timeDurationMap).map((key) => (
                      <StyledTimeSelector
                        key={key}
                        active={key === timeRange}
                        onClick={() => handleTimeRangeChange(key)}
                      >
                        <Span>{key}</Span>
                        <Dot active={key === timeRange} />
                      </StyledTimeSelector>
                    ))}
                  </StyledTimeRange>
                </div>
              </Row>
            )}
          </>
        )}

        <ChartContainer
          onMouseLeave={() => {
            dispatch({
              type: 'SET_HOVERED_POINT',
              payload: { y: closePrice },
            })
          }}
        >
          {loading ? (
            <>
              <Spacer size="md" />
              <LoadingContainerChart />
            </>
          ) : !isShowChart ? (
            <ChartPlaceholder text="We are still collecting data for this market .." />
          ) : (
            data?.length > 0 && (
              <Chart
                series={[
                  {
                    name: '',
                    data: data,
                  },
                ]}
                options={{
                  colors: [theme.color.font.green],
                  stroke: {
                    width: 3,
                    curve: 'smooth',
                  },
                  grid: {
                    show: false,
                    padding: {
                      left: 20,
                      top: 10,
                      bottom: 10,
                      right: 20,
                    },
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      type: 'vertical',
                      shadeIntensity: 1,
                      gradientToColors: ['#f5f5f8'],
                      inverseColors: false,
                      opacityFrom: 0.4,
                      opacityTo: 0,
                      stops: [0, 50, 100],
                    },
                  },
                  chart: {
                    id: 'priceChart',
                    type: 'line',
                    stacked: false,
                    parentHeightOffset: 0,
                    animations: {
                      enabled: false,
                    },
                    zoom: {
                      enabled: false,
                    },
                    toolbar: {
                      show: false,
                    },
                    events: {
                      mouseMove: function (event, chartContext, config) {
                        dispatch({
                          type: 'SET_HOVERED_POINT',
                          payload: data[config.dataPointIndex],
                        })
                        const tooltip = chartContext.el.querySelector(
                          '.apexcharts-tooltip'
                        )
                        if (!!tooltip) {
                          tooltip.style.top = 0 + 'px'
                        }
                      },
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  markers: {
                    size: 0,
                  },
                  yaxis: {
                    show: true,
                    showForNullSeries: false,
                    forceNiceScale: true,
                    opposite: true,
                    labels: {
                      style: { ...labelStyle },
                      formatter: function (value) {
                        return value
                          ? fromCurrency && toCurrency
                            ? precise(value, 4)
                            : '$' + precise(value, 4)
                          : ''
                      },
                    },
                    crosshairs: {
                      show: true,
                      position: 'back',
                      stroke: {
                        width: 1,
                        dashArray: 3,
                      },
                    },
                    tooltip: {
                      enabled: true,
                    },
                  },
                  xaxis: {
                    show: true,
                    tickPlacement: 'between',
                    labels: {
                      show: data.length ? true : false,
                      style: { ...labelStyle },
                      formatter: function (value) {
                        return value
                          ? dayjs
                              .unix(value)
                              .format(timeDurationMap[timeRange].graphFormat)
                          : ''
                      },
                    },
                    title: { style: { ...labelStyle } },
                    type: 'category',
                    axisBorder: {
                      show: false,
                    },
                    axisTicks: {
                      show: false,
                    },
                    tooltip: {
                      enabled: true,
                    },
                    crosshairs: {
                      show: true,
                      position: 'back',
                      stroke: {
                        width: 1,
                        dashArray: 3,
                      },
                    },
                  },
                  crosshairs: {
                    show: true,
                    position: 'back',
                    stroke: {
                      width: 1,
                      dashArray: 3,
                    },
                  },
                  tooltip: {
                    enabled: true,
                    shared: false,
                    marker: {
                      show: false,
                    },
                    custom: function ({
                      series,
                      seriesIndex,
                      dataPointIndex,
                      w,
                    }) {
                      return (
                        data?.[dataPointIndex]?.[timeRange] ||
                        dayjs
                          .unix(Date.now() / 1000)
                          .format(timeDurationMap[timeRange].format)
                      )
                    },
                  },
                }}
                type="area"
                height="100%"
              />
            )
          )}
        </ChartContainer>
      </StyledChartContainer>
    </StyledPriceChart>
  )
}

export default PriceChart

const StyledChartContainer = styled.div`
  height: 500px;
`
const Dot = styled.div`
  width: 5px;
  height: 5px;
  background: ${({ theme }) => theme.color.secondary.main};
  border-radius: 100%;
  opacity: ${(props) => (props.active ? 1 : 0)};
`

const StyledTimeRange = styled.div`
  margin-top: 0;
  display: flex;
  justify-content: center;
  margin-left: auto;
  color: ${({ theme }) => theme.color.secondary.main};
  transition: opacity 100ms ease-out 0s;
`

const LoadingContainerChart = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 22px;
  background-image: linear-gradient(
    to right,
    rgba(65, 222, 162, 0.45) 0%,
    rgba(65, 222, 162, 0.15) 100%
  );
`

const LoadingContainerPrice = styled.div`
  border-radius: 10px;
  height: 37px;
  max-width: 264px;
  background-image: linear-gradient(
    to right,
    rgba(65, 222, 162, 0.45) 0%,
    rgba(65, 222, 162, 0.15) 100%
  );
`

const LoadingContainerPriceSmall = styled(LoadingContainerPrice)`
  max-width: 162px;
`

const StyledTimeSelector = styled.div`
  cursor: pointer;
  width: auto;
  padding: 0 10px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${({ theme }) => theme.color.secondary.main};

  ${(props) =>
    props.active
      ? `
    pointer-events:none;
    `
      : `color:#212d63;opacity: 0.5;`}
`
const Span = styled.span`
  font-size: 12px;
  font-weight: 800;
`
const StyledPrice = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.color.secondary.main};
  font-size: 42px;
  display: flex;
`
const StyledPriceChange = styled.div`
  font-size: 14px;
  font-weight: 800;
`
const StyledTimeDisplay = styled.span`
  margin-left: 10px;
  opacity: 0.3;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
`
const ChartContainer = styled.div`
  height: 340px;
`

const StyledPriceChart = styled.div``

const StyledHeading = styled.div`
  display: flex;
  align-items: flex-end;
  height: 32px;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
`
const Row = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  align-items:baseline;
  flex-direction:column;
  height: 70px;
  `};
`
