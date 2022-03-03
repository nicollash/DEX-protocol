import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'

import { getLiquidity } from 'api'
import { timeDurationMap } from 'monox/util'
import { weiToEth } from 'monox/constants'
import BigNumber from 'bignumber.js'

import ChartPlaceholder from 'views/Swapper/components/ChartPlaceholder'
import useWallet from 'hooks/useWallet'

const labelStyle = {
  fontFamily: 'Nunito',
  fontSize: '13px',
  fontWeight: 800,
}

const AreaChart = ({ networkId, tokenAddress, timeRange }) => {
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])
  const { chainId } = useWallet()

  const getData = useCallback(
    async (tokenAddress, timeRange) => {
      const time = timeRange === '24H' ? 'hours' : 'days'
      const now = dayjs()
      const selected = timeDurationMap[timeRange]
      const start = now.subtract(selected.interval, selected.unit).unix()
      const data = await getLiquidity(
        chainId || networkId,
        tokenAddress,
        time,
        start
      )
      let records = []
      if (data?.result) {
        records = data?.response
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((e) => {
            const timestamp = e.timestamp
            const totalLiquidity = weiToEth(
              new BigNumber(parseInt(e.total_liquidity_avg))
            )
            return {
              x: dayjs
                .unix(timestamp)
                .format(timeDurationMap[timeRange].graphFormat),
              y: totalLiquidity,
              '1W': dayjs
                .unix(timestamp)
                .format(timeDurationMap['1W'].graphFormat),
              '24H': dayjs
                .unix(timestamp)
                .format(timeDurationMap['24H'].graphFormat),
            }
          })
        setChartData(records)
      }
      setLoading(false)
    },
    [chainId]
  )

  useEffect(() => {
    if (tokenAddress) {
      setLoading(true)
      getData(tokenAddress, timeRange)
    }
  }, [tokenAddress, timeRange, getData, chainId])

  if (loading || chartData?.length === 0) {
    return <LoadingContainerChart />
  }

  if (!loading && chartData.length < 2 && tokenAddress) {
    return (
      <ChartPlaceholder
        text="We are still collecting data for this market .."
        style={{ height: 200 }}
      />
    )
  }

  return (
    <Chart
      series={[
        {
          name: '',
          data: chartData,
        },
      ]}
      options={{
        colors: ['#3dcf97'],
        stroke: {
          width: 4,
          curve: 'smooth',
        },
        grid: {
          show: false,
        },
        chart: {
          id: 'coinChart',
          type: 'area',
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
        },
        fill: {
          type: 'gradient',
          gradient: {
            type: 'vertical',
            shadeIntensity: 1,
            gradientToColors: ['#f5f5f8'],
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0.48,
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
          labels: {
            offsetX: -10,
            style: { ...labelStyle },
            formatter: function (value) {
              return '$' + parseFloat(value).toFixed(4)
            },
          },
        },
        xaxis: {
          show: true,
          labels: {
            style: { ...labelStyle },
            offsetX: 2,
          },
          title: { style: { ...labelStyle } },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
          shared: false,
          marker: {
            show: false,
          },
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            return '$' + chartData?.[dataPointIndex]?.y
          },
        },
      }}
      type={'area'}
      height="100%"
    />
  )
}

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
export default AreaChart
