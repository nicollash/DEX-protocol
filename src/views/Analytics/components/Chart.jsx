import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import useWallet from 'hooks/useWallet'
import { timeDurationMap } from 'monox/util'
import config from 'monox/config'
import CardContainer from 'components/CardContainer'
import { RowBetween } from 'components/Row'
import AreaChart from 'views/Analytics/components/AreaChart'
import BarChart from 'views/Analytics/components/BarChart'

const filters = ['TVL', 'Volume']

const ChartAnalytics = ({ currency }) => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS

  const [selectedFilter, setSelectedFilter] = useState(filters[0])
  const [timeSelected, setTimeSelected] = useState('24H')

  const chartData = {
    TVL: (
      <AreaChart
        networkId={networkId}
        timeRange={timeSelected}
        tokenAddress={
          currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
        }
      />
    ),
    Volume: (
      <BarChart
        networkId={networkId}
        timeRange={timeSelected}
        tokenAddress={
          currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
        }
      />
    ),
  }

  return (
    <CardContainer style={{ width: '100%' }} maxWidth="1067">
      <InnerContainer>
        <ButtonRow>
          <ButtonGroup>
            {filters.map((filter) => (
              <SwitchButton
                key={filter}
                active={selectedFilter === filter}
                width="80"
                onClick={() => setSelectedFilter(filter)}
                style={{ margin: '0 15px 10px 0' }}
              >
                {filter}
              </SwitchButton>
            ))}
          </ButtonGroup>
          <ButtonGroup>
            {Object.keys(timeDurationMap).map((key) => (
              <TimeSelector
                key={key}
                active={key === timeSelected}
                onClick={() => setTimeSelected(key)}
              >
                {key}
                <Dot active={key === timeSelected} />
              </TimeSelector>
            ))}
          </ButtonGroup>
        </ButtonRow>
        <ChartContainer>{chartData[selectedFilter]}</ChartContainer>
      </InnerContainer>
    </CardContainer>
  )
}

const ChartContainer = styled.div`
  height: 200px;
`
const Dot = styled.div`
  width: 5px;
  height: 5px;
  background: ${({ theme }) => theme.color.secondary.main};
  border-radius: 100%;
  opacity: ${(props) => (props.active ? 1 : 0)};
`
const InnerContainer = styled.div`
  padding: 45px 85px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 45px;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 30px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 25px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 15px 15px;
  `}
`

const ButtonRow = styled(RowBetween)`
  align-items: baseline;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: column;
  `}
`

const SwitchButton = styled.div`
  min-width: 50px;
  cursor: pointer;
  margin: 0 15px 10px 0;
  height: 30px;
  padding: 0 18px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme, active }) =>
    active ? theme.color.primary.main : theme.color.secondary.main};
  font-size: 13px;
  font-weight: 800;
  background-color: ${({ theme }) => theme.color.background.main};
  :hover {
    color: ${({ theme }) => theme.color.primary.main};
  },
  ${(props) =>
    props.active
      ? `
    pointer-events:none;
    box-shadow:  ${({ theme }) => theme.shadows.inset};
    box-shadow: inset -8px -8px 20px 0 #ffffff, inset 8px 8px 20px 0 #d1d9e6;`
      : `box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff, -1px -1px 3px 0 #ffffff;`}
`

const TimeSelector = styled.div`
  min-width: 50px;
  cursor: pointer;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  color: ${({ theme }) => theme.color.secondary.main};
  font-size: 12px;
  font-weight: 800;
  background-color: ${({ theme }) => theme.color.background.main};
  ${(props) =>
    props.active
      ? `
    pointer-events:none;`
      : ``}
`

const ButtonGroup = styled.div`
  margin-top: 0;
  display: flex;
  justify-content: soace-between;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.color.secondary.main};
  transition: opacity 100ms ease-out 0s;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin: 8px 0
  `}
`
export default ChartAnalytics
