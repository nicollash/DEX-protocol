import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'

import { getVolume } from 'api'
import { timeDurationMap } from 'monox/util'
import { weiToEth } from 'monox/constants'
import useWallet from 'hooks/useWallet'
import ChartPlaceholder from 'views/Swapper/components/ChartPlaceholder'

const labelStyle = {
  fontFamily: 'Nunito',
  fontSize: '13px',
  fontWeight: 800,
}

const BarChart = ({ networkId, tokenAddress, timeRange }) => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)
  const { chainId } = useWallet()

  const getData = useCallback(async (tokenAddress, timeRange) => {
    const time = timeRange === '24H' ? 'hours' : 'days'
    const now = dayjs()
    const selected = timeDurationMap[timeRange]
    const start = now.subtract(selected.interval, selected.unit).unix()
    const data = await getVolume(chainId || networkId, tokenAddress, time, start)
    let records = []
    if (data?.result) {
      records = data?.response
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((e) => {
          const timestamp = e.timestamp
          const totalVolume = weiToEth(
            new BigNumber(parseInt(e.VolumeIn) + parseInt(e.VolumeOut))
          )
          return {
            x: dayjs
              .unix(timestamp)
              .format(timeDurationMap[timeRange].graphFormat),
            y: totalVolume,
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
  }, [])

  useEffect(() => {
    if (tokenAddress) {
      setLoading(true)
      getData(tokenAddress, timeRange)
    }
  }, [tokenAddress, timeRange, getData])

  if (loading || chartData?.length === 0) {
    return <LoadingContainerChart />
  }

  if (!loading && chartData.length < 3 && tokenAddress) {
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
          width: 0,
          curve: 'smooth',
        },
        grid: {
          show: false,
        },
        chart: {
          id: 'coinChart',
          type: 'bar',
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
            shadeIntensity: 1,
            gradientToColors: ['#43e39d'],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [20, 100, 100, 100],
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        yaxis: {
          showForNullSeries: false,
          show: true,
          labels: {
            style: { ...labelStyle },
            formatter: function (value) {
              return '$' + parseFloat(value).toFixed(4)
            },
          },
        },
        xaxis: {
          show: true,
          type: 'category',
          tickPlacement: 'on',
          labels: {
            show: chartData.length ? true : false,
            style: { ...labelStyle },
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
      type={'bar'}
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

export default BarChart
