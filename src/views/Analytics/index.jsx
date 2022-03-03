import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useParams, useHistory } from 'react-router'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { ArrowBack } from '@styled-icons/boxicons-regular/ArrowBack'

import { supportedChainIds } from 'monox/connectors'
import { lpToken } from 'monox/constants'
import Header from 'views/Analytics/components/Header'
import ChartAnalytics from 'views/Analytics/components/Chart'
import DataCard from 'views/Analytics/components/DataCard'
import TransactionsTable from 'views/Analytics/components/TransactionsTable'
import InfoCard from 'views/Analytics/components/InfoCard'
import NetworkWarning from 'views/Analytics/components/NetworkWarning'
import { RowBetween } from 'components/Row'
import Label from 'components/Label'
import SearchBar from 'components/SearchBar'

import useSearchToken from 'hooks/useSearchToken'
import usePool from 'hooks/usePool'
import useWalletHook from 'hooks/useWallet'
import config from 'monox/config'

import { getAnalysisData } from 'api'

const Analytics = () => {
  const [data, setData] = useState({})
  const [fetching, setFetching] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  const { chainId } = useWalletHook()
  const privateKey = useSelector(({ user }) => user.privateKey)
  const networkId = useSelector(({ network }) => network.id)
  const index = supportedChainIds.findIndex((id) => id === parseInt(networkId))
  const isWarning = privateKey ? false : index > -1 ? false : true
  const wallet = useSelector(({ user }) => user.wallet)

  const showWarning = chainId && networkId !== chainId

  const history = useHistory()
  const { address } = useParams()

  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const networkName = config[networkId || chainId].NAME?.toLowerCase()
  const [currency, setCurrency] = useState(null)

  const { onGetToken } = useSearchToken()
  const { pool, sharedPercent } = usePool(
    currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
  )

  const setToken = useCallback(async () => {
    const indexToRemove = address?.indexOf('?')
    const ts = await onGetToken(
      indexToRemove > 0 ? address.substring(0, indexToRemove) : address
    )
    if (ts && ts.length > 0) {
      setCurrency(ts[0])
    }
  }, [address, onGetToken])

  useEffect(() => {
    if (address === lpToken.address) {
      window.location.href =
        'https://docs.monox.finance/getting-started/vusd-stablecoin'
      return
    }

    if (address) {
      setToken()
    }
  }, [address, setToken])

  useEffect(() => {
    const fetchData = async () => {
      const now = dayjs()
      const start = now.subtract(1, 'day').unix()
      const res = await getAnalysisData(
        chainId,
        currency.address || WRAPPED_MAIN_ADDRESS,
        start
      )
      if (res && res.result) {
        setData(res.response)
      }
      setDataFetched(true)
      setFetching(false)
    }

    if (currency && !dataFetched && !fetching && chainId) {
      setFetching(true)
      fetchData()
    }
  }, [currency, dataFetched, fetching, chainId])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  const handleBack = () => {
    const backUrl = history.location?.state?.backUrl ?? '/'
    history.push({
      pathname: backUrl,
      search: `?network=${networkName}`,
    })
  }

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <title>Analytics | MonoX</title>
        </Helmet>
        <Row>
          <div style={{ display: 'flex' }}>
            <StyledArrowLeft onClick={handleBack} />
            <Label size="16" weight="800" text="Tokens" />
          </div>
          <Col>
            <SearchBar
              fullWidth={false}
              text="Filter Tokens"
              setDataFetched={setDataFetched}
            />
          </Col>
        </Row>
        <Spacer height={54} />
        {isWarning || (showWarning && wallet) ? (
          <NetworkWarning />
        ) : (
          <>
            <Header currency={currency} pool={pool} />
            <Spacer height={55} />
            <DataCard
              currency={currency}
              pool={pool}
              sharedPercent={sharedPercent}
              data={data}
            />
            <Spacer height={45} />
            <ChartAnalytics currency={currency} />
            <Spacer />
            <TransactionsTable currency={currency} />
            <Spacer />
            <InfoCard currency={currency} />
            <Spacer />
          </>
        )}
      </Container>
    </HelmetProvider>
  )
}

export default Analytics

const Spacer = styled.div`
  height: ${(props) => props.height ?? '80'}px;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 50px;
  `}
`

const Row = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: column;
  align-items:baseline
  `}
`

const Container = styled.div`
  flex-direction: column;
  align-items: center;
  display: flex;
  max-width: 1067px;
  margin: 0 auto;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    max-width: 750px;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 660px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding:0 40px;
  `}
`
const StyledArrowLeft = styled(ArrowBack)`
  color: ${({ theme }) => theme.color.secondary.main};
  margin-right: 15px;
  width: 25px;
  height: 25px;
  cursor: pointer;
`

const Col = styled(RowBetween)`
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top:10px;
  `}
`
