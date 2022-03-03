import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import theme from 'theme'
import BigNumber from 'bignumber.js'
import useWallet from 'hooks/useWallet'
import Loader from 'components/Loader'
import { getPrices } from 'api'
import { weiToEth } from 'monox/constants'

const chartOptions = {
  chart: {
    type: 'line',
    width: 50,
    height: 35,
    sparkline: {
      enabled: true,
    },
  },
  colors: [theme.color.font.green],
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (value) {
          return ''
        },
      },
    },
    marker: {
      show: false,
    },
  },
}

const OneDayChartData = ({ handleAnalytics, token, pid }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [series, setSeries] = useState([
    {
      data: [],
    },
  ])
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)

  const now = dayjs()
  const timeParams = {
    start: now.subtract(7, 'day').unix(),
    end: now.unix(),
  }
  const params = `pid=eq.${pid}&timestamp=gte.${timeParams.start}&timestamp=lte.${timeParams.end}`

  useEffect(() => {
    setIsLoading(true)
    getPrices(chainId || networkId, params)
      .then((res) => {
        setIsLoading(false)
        if (res?.response && Array.isArray(res?.response)) {
          const prices = res?.response.map((item) =>
            weiToEth(new BigNumber(item.price))
          )
          setSeries([
            {
              data: prices,
            },
          ])
        } else {
          setSeries([
            {
              data: [],
            },
          ])
        }
      })
      .catch((error) => {
        console.error(error.message)
        setIsLoading(false)
        setSeries([
          {
            data: [],
          },
        ])
      })
  })

  if (isLoading || series?.data?.length === 0)
    return <Loader color="primary" height="35" />
  return (
    <Chart options={chartOptions} series={series} type="line" height={35} />
  )
}

export default OneDayChartData
