import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BigNumber from 'bignumber.js'

import useWallet from 'hooks/useWallet'
import useTokenTrans from 'hooks/useTokenTrans'
import usePool from 'hooks/usePool'

import { StyledExternalLink } from 'theme'
import StyledDataTable from 'components/StyledDataTable'
import { Row } from 'components/Row'
import Label from 'components/Label'
import { weiToEthNum } from 'monox/constants'
import { toEllipsis, getEtherscanLink, tokenSymbol } from 'monox/util'
import { precise } from 'monox/util'
import config from 'monox/config'

const RecentTrades = ({ fromCurrency, toCurrency }) => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const successEnded = useSelector(({ swap }) => swap.successEnded)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const MAIN_CURRENCY = config[networkId || chainId].MAIN_CURRENCY
  const VUSD_ADDRESS = useSelector(({ network }) => network.vUSD)?.address

  dayjs.extend(relativeTime)

  const { pool } = usePool(
    fromCurrency?.address || (!!fromCurrency?.symbol && WRAPPED_MAIN_ADDRESS)
  )

  const { transList, loading, getTokenTransactions } = useTokenTrans(
    'swap',
    fromCurrency?.address || (!!fromCurrency?.symbol && WRAPPED_MAIN_ADDRESS)
  )

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      getTokenTransactions()
    }
  }, [fromCurrency, toCurrency, successEnded])

  const filteredList = (transListArray = []) => {
    if (
      fromCurrency?.address &&
      toCurrency?.address &&
      Array.isArray(transListArray)
    ) {
      return transListArray
        .filter(
          (item) =>
            (item?.tokenIn?.toLowerCase() ===
              fromCurrency?.address?.toLowerCase() &&
              item?.tokenOut?.toLowerCase() ===
                toCurrency?.address?.toLowerCase()) ||
            (item?.tokenIn?.toLowerCase() ===
              toCurrency?.address?.toLowerCase() &&
              item?.tokenOut?.toLowerCase() ===
                fromCurrency?.address?.toLowerCase())
        )
        .sort((a, b) => b?.timestamp - a?.timestamp)
    } else if (fromCurrency?.symbol && !fromCurrency?.address) {
      return transListArray
        .filter(
          (item) =>
            (item?.tokenIn?.toLowerCase() ===
              WRAPPED_MAIN_ADDRESS.toLowerCase() &&
              item?.tokenOut?.toLowerCase() ===
                toCurrency?.address?.toLowerCase()) ||
            (item?.tokenIn?.toLowerCase() ===
              toCurrency?.address?.toLowerCase() &&
              item?.tokenOut?.toLowerCase() ===
                WRAPPED_MAIN_ADDRESS.toLowerCase())
        )
        .sort((a, b) => b?.timestamp - a?.timestamp)
    } else if (toCurrency?.symbol && !toCurrency?.address) {
      return transListArray
        .filter(
          (item) =>
            (item?.tokenIn?.toLowerCase() ===
              fromCurrency?.address?.toLowerCase() &&
              item?.tokenOut?.toLowerCase() ===
                WRAPPED_MAIN_ADDRESS.toLowerCase()) ||
            (item?.tokenIn?.toLowerCase() ===
              WRAPPED_MAIN_ADDRESS.toLowerCase() &&
              item?.tokenOut?.toLowerCase() ===
                fromCurrency?.address?.toLowerCase())
        )
        .sort((a, b) => b?.timestamp - a?.timestamp)
    }
  }
  const columns = React.useMemo(
    () => [
      {
        Header: 'Swaps',
        accessor: 'swap',
        style: { width: '14%' },
        Cell: function symbolRow({ row }) {
          const { tokenIn, tokenOut, transactionHash } = row?.original
          const isSwapFor = fromCurrency?.address
            ? tokenIn?.toLowerCase() === fromCurrency?.address?.toLowerCase()
            : tokenOut?.toLowerCase() === toCurrency?.address?.toLowerCase()
          return (
            <StyledExternalLink
              target="_blank"
              href={getEtherscanLink(chainId, transactionHash, 'transaction')}
              rel="noopener noreferrer"
              style={{ justifyContent: 'left' }}
            >
              <Label
                text={`${
                  !fromCurrency?.address &&
                  toCurrency?.address === WRAPPED_MAIN_ADDRESS
                    ? 'Wrap'
                    : fromCurrency?.address === WRAPPED_MAIN_ADDRESS &&
                      !toCurrency?.address
                    ? 'Unwrap'
                    : ''
                } ${
                  isSwapFor
                    ? tokenSymbol(
                        fromCurrency,
                        WRAPPED_MAIN_ADDRESS,
                        MAIN_CURRENCY
                      )
                    : tokenSymbol(
                        toCurrency,
                        WRAPPED_MAIN_ADDRESS,
                        MAIN_CURRENCY
                      )
                } ${
                  (!fromCurrency?.address &&
                    toCurrency?.address === WRAPPED_MAIN_ADDRESS) ||
                  (fromCurrency?.address === WRAPPED_MAIN_ADDRESS &&
                    !toCurrency?.address)
                    ? 'to'
                    : 'for'
                } ${
                  isSwapFor
                    ? tokenSymbol(
                        toCurrency,
                        WRAPPED_MAIN_ADDRESS,
                        MAIN_CURRENCY
                      )
                    : tokenSymbol(
                        fromCurrency,
                        WRAPPED_MAIN_ADDRESS,
                        MAIN_CURRENCY
                      )
                }`}
                size="12"
                weight="bold"
                color="#2eca93"
              />
            </StyledExternalLink>
          )
        },
      },
      {
        Header: 'Total Value',
        accessor: 'Symbol',
        style: { width: '14%' },
        Cell: function symbolRow({ row }) {
          const { amountIn, amountOut, tokenIn, tokenOut, fee } = row?.original
          const isSwapFor = fromCurrency?.address
            ? tokenIn?.toLowerCase() === fromCurrency?.address?.toLowerCase()
            : tokenOut?.toLowerCase() === toCurrency?.address?.toLowerCase()
          const price = !!weiToEthNum(BigNumber(pool?.price))
            ? weiToEthNum(BigNumber(pool?.price))
            : 1
          const tokenAmount = weiToEthNum(
            BigNumber(isSwapFor ? amountIn : amountOut)
          )
          let amount = price * tokenAmount
          if (
            tokenIn === VUSD_ADDRESS &&
            amount < weiToEthNum(BigNumber(amountIn))
          ) {
            amount = weiToEthNum(BigNumber(amountIn))
          } else if (
            tokenOut === VUSD_ADDRESS &&
            amount < weiToEthNum(BigNumber(amountOut))
          ) {
            amount = weiToEthNum(BigNumber(amountOut))
          }
          return (
            <Label text={`$${amount.toFixed(6)}`} size="12" weight="bold" />
          )
        },
      },
      {
        Header: 'Token Amount',
        accessor: 'tokenIn',
        style: { width: '14%' },
        Cell: function symbolRow({ row }) {
          const { amountIn, tokenIn, tokenOut } = row?.original
          const isSwapFor = fromCurrency?.address
            ? tokenIn?.toLowerCase() === fromCurrency?.address?.toLowerCase()
            : tokenOut?.toLowerCase() === toCurrency?.address?.toLowerCase()
          const tokenAmount = weiToEthNum(BigNumber(amountIn))
          return (
            <Label
              text={`${precise(tokenAmount.toFixed(6), 6)} ${
                isSwapFor
                  ? tokenSymbol(
                      fromCurrency,
                      WRAPPED_MAIN_ADDRESS,
                      MAIN_CURRENCY
                    )
                  : tokenSymbol(toCurrency, WRAPPED_MAIN_ADDRESS, MAIN_CURRENCY)
              }`}
              size="12"
              weight="bold"
            />
          )
        },
      },
      {
        Header: 'Token Amount',
        accessor: 'tokenOut',
        style: { width: '14%' },
        Cell: function priceRow({ row }) {
          const { amountOut, tokenIn, tokenOut } = row?.original
          const isSwapFor = fromCurrency?.address
            ? tokenIn?.toLowerCase() === fromCurrency?.address?.toLowerCase()
            : tokenOut?.toLowerCase() === toCurrency?.address?.toLowerCase()
          const tokenAmount = weiToEthNum(BigNumber(amountOut))
          return (
            <Label
              text={`${precise(tokenAmount.toFixed(6), 6)} ${
                isSwapFor
                  ? tokenSymbol(toCurrency, WRAPPED_MAIN_ADDRESS, MAIN_CURRENCY)
                  : tokenSymbol(
                      fromCurrency,
                      WRAPPED_MAIN_ADDRESS,
                      MAIN_CURRENCY
                    )
              }`}
              size="12"
              weight="bold"
            />
          )
        },
      },
      {
        Header: 'Account',
        accessor: 'Last 24h',
        style: { width: '14%' },
        Cell: function dayRow({ row }) {
          const { user } = row?.original
          return (
            <Row>
              <StyledExternalLink
                target="_blank"
                href={getEtherscanLink(chainId, user, 'address')}
                rel="noopener noreferrer"
                style={{ justifyContent: 'left' }}
              >
                <Label
                  text={toEllipsis(user, 16)}
                  size="12"
                  weight="bold"
                  color="#2eca93"
                />
              </StyledExternalLink>
            </Row>
          )
        },
      },
      {
        Header: 'Time',
        accessor: 'Market Cap',
        style: { width: '14%' },
        Cell: function marketcapRow({ row }) {
          const { timestamp } = row.original
          const fromNow = dayjs(new Date(timestamp * 1000)).fromNow()
          return <Label text={fromNow} size="12" weight="bold" />
        },
      },
    ],
    [pool, fromCurrency, toCurrency]
  )
  return (!fromCurrency?.address &&
    toCurrency?.address === WRAPPED_MAIN_ADDRESS) ||
    (fromCurrency?.address === WRAPPED_MAIN_ADDRESS && !toCurrency?.address) ? (
    ''
  ) : (
    <Container>
      <Label weight={800} text="Recent Trades" />
      <Div>
        <StyledDataTable
          columns={columns}
          data={filteredList(transList)}
          sort={false}
          striped={false}
          hoverable={true}
          loading={loading}
          withOutPagePagination={true}
          padding="35"
        />
      </Div>
    </Container>
  )
}

export default RecentTrades

const Div = styled.div`
  padding: 20px 0;
  margin-top: -5px;
  display: flex;
  width: 100%;
  grid-area: recentTrades;
`

const Container = styled.div`
  max-width: 643px;
`
