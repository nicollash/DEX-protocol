import React, { useEffect, useReducer, useState } from 'react'
import Chart from 'react-apexcharts'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import theme from 'theme'
import { generateChartData, timeDurationMap, setTokenValue } from 'monox/util'
import kovanTokenList from 'monox/kovan.json'

const initialState = {
  data: [],
  basePrice: 0,
  timeRange: '24H',
  hoveredPoint: {},
  showPriceChange: false,
}

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

const TimeSeries = () => {
  const param = useParams()
  const [title, setTitle] = useState({})
  const [state, dispatch] = useReducer(chartReducer, initialState)
  const { timeRange, data, hoveredPoint } = state

  const [options, setOptions] = useState({})

  useEffect(() => {
    setTitle(param)
  }, [param])

  useEffect(() => {
    if (!data?.length) {
      return
    }
    setOptions({
      colors: [theme.color.primary.main],
      stroke: {
        width: 4,
        curve: 'smooth',
      },
      grid: {
        show: false,
      },
      chart: {
        type: 'line',
        stacked: false,
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
        events: {
          mouseMove: function (event, chartContext, config) {
            dispatch({
              type: 'SET_HOVERED_POINT',
              payload: data[config.dataPointIndex],
            })
            const tooltip = chartContext.el.querySelector('.apexcharts-tooltip')
            tooltip.style.top = 0 + 'px'
          },
        },
        dropShadow: {
          enabled: true,
          top: 4,
          left: 0,
          blur: 5,
          opacity: 0.5,
          color: [theme.color.primary.main],
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      yaxis: {
        show: false,
        min: 1000,
        max: 1350,
      },
      xaxis: {
        show: false,
        type: 'datetime',
        labels: { show: false },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        shared: false,
        marker: {
          show: false,
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return data?.[dataPointIndex]?.[timeRange]
        },
      },
    })
  }, [data, timeRange])

  useEffect(() => {
    const result = generateChartData(timeRange)
    dispatch({ type: 'SET_DATA', payload: result.data })
    dispatch({ type: 'SET_BASE_PRICE', payload: result.basePrice })
  }, [timeRange])

  const closePrice = data.length && data[data.length - 1].y
  const isHovered =
    hoveredPoint && Object.keys(hoveredPoint).length ? true : false
  const currentPrice = isHovered ? hoveredPoint.y : closePrice

  const handleTimeRangeChange = (value) => {
    dispatch({ type: 'SET_TIME_RANGE', payload: value })
  }

  const priceDiff = currentPrice - closePrice

  const symbol2 = title.symbol2
    ? setTokenValue(title.symbol2, kovanTokenList)?.symbol
    : ''

  return (
    <StyledChartContainer>
      <StyledPrice>
        {`${symbol2 ? '' : '$'}${closePrice.toFixed(4)}`} {symbol2}
      </StyledPrice>
      <StyledPriceChange
        style={{
          color:
            closePrice - currentPrice < 0
              ? theme.color.font.primary
              : 'rgb(255, 101, 109)',
        }}
      >
        {` ${priceDiff < 0 ? '-' : ''}$${Math.abs(priceDiff).toFixed(6)}`}{' '}
        &nbsp;
        {`( ${priceDiff < 0 ? '' : '+'}${(
          (priceDiff * 100) /
          closePrice
        ).toFixed(2)} % )`}
        <StyledTimeDisplay>
          {timeDurationMap[timeRange].displayText}
        </StyledTimeDisplay>
      </StyledPriceChange>
      <ChartContainer
        onMouseLeave={() => {
          dispatch({
            type: 'SET_HOVERED_POINT',
            payload: { y: closePrice },
          })
        }}
      >
        <Chart
          series={[
            {
              name: '',
              data: data,
            },
          ]}
          options={options}
          type="line"
          height="100%"
        />
      </ChartContainer>
      <StyledTimeRange>
        {Object.keys(timeDurationMap).map((key) => (
          <StyledTimeSelector
            key={key}
            active={key === timeRange}
            onClick={() => handleTimeRangeChange(key)}
          >
            <Span>{key}</Span>
          </StyledTimeSelector>
        ))}
      </StyledTimeRange>
    </StyledChartContainer>
  )
}

export default TimeSeries

const StyledChartContainer = styled.div`
  height: 550px;
`
const StyledTimeRange = styled.div`
  margin-top: 0;
  display: flex;
  justify-content: center;
  margin-left: auto;
  color: ${({ theme }) => theme.color.secondary.main};
  transition: opacity 100ms ease-out 0s;
`
const StyledTimeSelector = styled.div`
  cursor: pointer;
  margin: 0 15px;
  width: 60px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.background.main};
  ${(props) =>
    props.active
      ? `
    box-shadow:  ${({ theme }) => theme.shadows.inset};`
      : `box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff, -1px -1px 3px 0 #ffffff;`}
`
const Span = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
`
const StyledPrice = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.color.secondary.main};
  font-size: 36px;
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
  margin-bottom: 35px;
`
