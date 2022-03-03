import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BigNumber from 'bignumber.js'
import { ExternalLink } from '@styled-icons/evil/ExternalLink'

import useTokenTrans from 'hooks/useTokenTrans'
import useSymbolList from 'hooks/useSymbolList'
import useWallet from 'hooks/useWallet'
import usePool from 'hooks/usePool'
import { weiToEthNum } from 'monox/constants'
import config from 'monox/config'
import { StyledExternalLink } from 'theme'

import Label from 'components/Label'
import { Row, RowBetween, RowFixed } from 'components/Row'
import StyledDataTable from 'components/StyledDataTable'
import TokenImage from 'components/TokenImage'
import Spacer from 'components/Spacer'

import {
  toEllipsis,
  getEtherscanLink,
  getTokenMetaFromAddress,
} from 'monox/util'

const TransactionsTable = ({ currency }) => {
  dayjs.extend(relativeTime)
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const MONOData = config[networkId || chainId].MONO
  const vUSDData = config[networkId || chainId].vUSD

  const getTokenMeta = (address) => {
    if (getTokenMetaFromAddress(address))
      return getTokenMetaFromAddress(address)
    else if (address === vUSDData?.address) return vUSDData
    else if (address === MONOData?.address) return MONOData
  }
  const { symbolList } = useSymbolList()

  const arrayToObject = (array) =>
    array.reduce((obj, item) => {
      obj[item?.token] = item
      return obj
    }, {})

  const SymbolData = arrayToObject(symbolList)

  const [transactionFilter, setTransactionFilter] = useState('swap')
  const { pool } = usePool(
    currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
  )
  const { transList, loading, getTokenTransactions } = useTokenTrans(
    transactionFilter,
    (currency?.address === vUSDData?.address && currency?.address) || pool
  )

  useEffect(() => {
    if (pool && chainId) {
      getTokenTransactions(transactionFilter, pool)
    }
  }, [transactionFilter, pool, chainId])

  const columns = React.useMemo(
    () => [
      {
        Header: function header(props) {
          return (
            <RowBetween style={{ width: '230px' }}>
              <Filter
                selected={transactionFilter === 'swap'}
                onClick={() => setTransactionFilter('swap')}
              >
                Swap
              </Filter>
              {currency?.address !== vUSDData?.address && (
                <Filter
                  selected={transactionFilter === 'adds'}
                  onClick={() => setTransactionFilter('adds')}
                >
                  Adds
                </Filter>
              )}
              {currency?.address !== vUSDData?.address && (
                <Filter
                  selected={transactionFilter === 'removes'}
                  onClick={() => setTransactionFilter('removes')}
                >
                  Removes
                </Filter>
              )}
            </RowBetween>
          )
        },
        accessor: 'a',
        style: { width: '30%', opacity: 1 },
        defaultCanSort: false,
        Cell: function tokenRow({ row }) {
          const { tokenIn, tokenOut, token, transactionHash } = row?.original
          const tokenData = getTokenMeta(token)

          if (token) {
            const transType =
              transactionFilter === 'adds'
                ? 'Add Liquidity'
                : 'Remove Liquidity'
            return (
              <Row>
                <Col last>
                  <Tokens>
                    <TokenImage
                      src={tokenData?.logoURI}
                      letter={
                        SymbolData[token]?.token_symbol &&
                        SymbolData[token]?.token_symbol[0]
                      }
                    />
                  </Tokens>
                  <Spacer size="sm" />
                  <StyledExternalLink
                    target="_blank"
                    href={getEtherscanLink(
                      chainId,
                      transactionHash,
                      'transaction'
                    )}
                    rel="noopener noreferrer"
                    style={{ justifyContent: 'left' }}
                  >
                    <Label
                      text={`${
                        SymbolData[token]?.token_symbol || tokenData?.symbol
                      } ${transType}`}
                      size="13"
                      weight="800"
                      primary
                    />
                  </StyledExternalLink>
                </Col>
              </Row>
            )
          }
          const tokenInData = getTokenMeta(tokenIn)
          const tokenOutData = getTokenMeta(tokenOut)
          return (
            <Row>
              <Col last>
                <Tokens>
                  <TokenImage
                    src={tokenInData?.logoURI}
                    letter={
                      SymbolData[tokenIn]?.token_symbol &&
                      SymbolData[tokenIn]?.token_symbol[0]
                    }
                  />
                  <TokenImage
                    src={tokenOutData?.logoURI}
                    letter={
                      SymbolData[tokenOut]?.token_symbol &&
                      SymbolData[tokenOut]?.token_symbol[0]
                    }
                    style={{ marginLeft: '-10px' }}
                  />
                </Tokens>
                <Spacer size="sm" />
                <StyledExternalLink
                  target="_blank"
                  href={getEtherscanLink(
                    chainId,
                    transactionHash,
                    'transaction'
                  )}
                  rel="noopener noreferrer"
                  style={{ justifyContent: 'left' }}
                >
                  <Label
                    text={`Swap ${
                      SymbolData[tokenIn]?.token_symbol || tokenInData?.symbol
                    } for ${
                      SymbolData[tokenOut]?.token_symbol || tokenOutData?.symbol
                    }`}
                    size="13"
                    weight="800"
                    primary
                  />
                </StyledExternalLink>
              </Col>
            </Row>
          )
        },
      },
      {
        Header: 'Total Value',
        accessor: 'Symbol',
        style: { width: '14%' },
        Cell: function symbolRow({ row }) {
          const {
            amountIn,
            tokenIn,
            tokenOut,
            amountOut,
            tokenAmount,
            vusdAmount,
          } = row?.original
          let price = !!weiToEthNum(BigNumber(pool?.price))
            ? weiToEthNum(BigNumber(pool?.price))
            : 1
          let tokenAmountFormat = weiToEthNum(
            BigNumber(amountIn || tokenAmount)
          )
          if (tokenIn === vUSDData?.address) {
            price = 1
            tokenAmountFormat = weiToEthNum(BigNumber(amountIn))
          } else if (tokenOut === vUSDData?.address) {
            price = 1
            tokenAmountFormat = weiToEthNum(BigNumber(amountOut))
          }
          const vusdAmountFormat = weiToEthNum(BigNumber(vusdAmount || '0'))
          const amount = price * tokenAmountFormat + vusdAmountFormat
          return <Label text={`$${amount.toFixed(6)}`} size="13" weight="800" />
        },
      },
      {
        Header: 'Token Amount',
        accessor: 'Symbol1',
        style: { width: '14%' },
        Cell: function symbolRow({ row }) {
          const { amountIn, tokenIn, tokenAmount, token } = row?.original
          const tokenData = getTokenMeta(tokenIn || token)
          const tokenAmountFormat = weiToEthNum(
            BigNumber(amountIn || tokenAmount)
          )
          return (
            <Label
              text={`${tokenAmountFormat.toFixed(6)} ${
                SymbolData[tokenIn || token]?.token_symbol || tokenData?.symbol
              }`}
              size="13"
              weight="800"
            />
          )
        },
      },
      {
        Header: `${
          transactionFilter === 'swap'
            ? 'Token Amount'
            : transactionFilter === 'adds'
            ? ''
            : 'vUSD amount'
        }`,
        accessor: 'Price',
        style: { width: transactionFilter === 'adds' ? '1%' : '14%' },
        Cell: function priceRow({ row }) {
          const { amountOut, tokenOut, vusdAmount } = row?.original
          const tokenOutData = getTokenMeta(tokenOut)
          const tokenAmountFormat = weiToEthNum(
            BigNumber(amountOut || vusdAmount)
          )
          if (transactionFilter === 'removes') {
            return (
              <Label
                text={tokenAmountFormat.toFixed(6)}
                size="13"
                weight="800"
              />
            )
          }
          if (transactionFilter === 'adds') {
            return <></>
          }
          return (
            <Label
              text={`${tokenAmountFormat.toFixed(6)} ${
                SymbolData[tokenOut]?.token_symbol || tokenOutData?.symbol
              }`}
              size="13"
              weight="800"
            />
          )
        },
      },
      {
        Header: 'Account',
        accessor: 'Last 24h',
        style: { width: '14%' },

        Cell: function dayRow({ row }) {
          const { user, provider } = row?.original
          return (
            <Row>
              <StyledExternalLink
                target="_blank"
                href={getEtherscanLink(chainId, user || provider, 'address')}
                rel="noopener noreferrer"
                style={{ justifyContent: 'left' }}
              >
                <Label
                  text={toEllipsis(user || provider, 16)}
                  size="13"
                  weight="800"
                  primary
                />
                <ExternalLink size="20" />
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
          return <Label text={fromNow} size="13" weight="800" />
        },
      },
    ],
    [transactionFilter, pool, SymbolData]
  )
  return (
    <StyledDataTable
      columns={columns}
      data={transList.sort((a, b) => b?.timestamp - a?.timestamp)}
      pagination
      sort={false}
      loading={loading}
      striped={false}
      hoverable={true}
      isAnalytics={true}
      withOutPagePagination={true}
    />
  )
}

const Col = styled(RowFixed)`
  justify-content: ${(props) => props.icon && 'center'};
  margin-left: ${(props) => props.last && '15px'};
`
const Tokens = styled.div`
  display: flex;
`
const Filter = styled.div`
  font-size: 13px;
  font-weight: 800;
  padding: 3px 10px;
  cursor: pointer;
  color: ${({ theme, selected }) =>
    selected ? theme.color.white : theme.color.primary.main};
  background: ${({ theme, selected }) =>
    selected ? theme.color.primary.main : 'none'};
  border-radius: ${({ selected }) => (selected ? '12px' : 0)};
`
export default TransactionsTable
