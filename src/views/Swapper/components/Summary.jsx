import React, { useCallback, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'

import Label from 'components/Label'
import Divider from 'components/Divider'
import Spacer from 'components/Spacer'

import { getAllTokenLiquidity, getPrices } from 'api'
import UpTriangle from 'assets/img/up-triangle.png'
import DownTriangle from 'assets/img/down-triangle.png'
import useWalletHook from 'hooks/useWallet'
import useCoinsInfo from 'hooks/useCoinsInfo'
import BigNumber from 'bignumber.js'
import { weiToEth, weiToEthNum } from 'monox/constants'
import { usePrismic } from 'hooks/usePrismic'
import { useSelector } from 'react-redux'
import { formatAmount, timeDurationMap } from 'monox/util'

const Summary = ({ currency, toPool }) => {
  const _isMounted = useRef(true)
  const [data, setData] = useState(null)
  const { chainId } = useWalletHook()
  const [internal1, setInternal1] = useState('')
  const [internal2, setInternal2] = useState('')
  const [external, setExternal] = useState('')
  const [price, setPrice] = useState(0)
  const networkId = useSelector(({ network }) => network.id)

  const { genericDescription, partnerTokens } = usePrismic()
  const { selectedCoinInfo } = useCoinsInfo(currency)
  const VUSD_ADDRESS = useSelector(({ network }) => network.vUSD)?.address

  const getTimeParams = useCallback(() => {
    const now = dayjs()
    const selected = timeDurationMap['24H']
    const start = now.subtract(selected.interval, selected.unit)
    return { start: start.unix(), end: now.unix() }
  }, [])

  useEffect(() => {
    return () => {
      _isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const timeParams = getTimeParams()
    const params = `pid=eq.${toPool?.pid}&timestamp=gte.${timeParams.start}&timestamp=lte.${timeParams.end}`
    if (currency?.address !== VUSD_ADDRESS) {
      getPrices(chainId || networkId, params).then((res) => {
        if (Array.isArray(res?.response) && _isMounted.current) {
          const data = res?.response?.sort((a, b) => b.timestamp - a.timestamp)
          setPrice(weiToEth(new BigNumber(data?.[0]?.price)))
        }
      })
    } else {
      setPrice(1)
    }
  }, [toPool])

  useEffect(() => {
    if (currency && genericDescription) {
      const description = partnerTokens.find(
        (token) => token?.[0]?.token?.address === currency?.address
      )
      setInternal1(
        description?.internal_description ??
          genericDescription?.internal_description_line_1?.[0].text
      )
      setInternal2(
        description?.internal_description ??
          genericDescription?.internal_description_line_2?.[0].text
      )

      if (!selectedCoinInfo?.market_data?.max_supply) {
        const tempExternalDesc = genericDescription?.external_description?.[0]?.text.split(
          'and the max supply'
        )
        setExternal(`${tempExternalDesc?.[0]?.trim()}.`)
      } else {
        setExternal(
          description?.external_description ??
            genericDescription?.external_description?.[0]?.text
        )
      }
    }
  }, [genericDescription, partnerTokens, currency, selectedCoinInfo])

  useEffect(() => {
    const getData = async () => {
      const liquidityAmount = await getAllTokenLiquidity(chainId)
      if (
        liquidityAmount?.result &&
        Array.isArray(liquidityAmount?.response) &&
        _isMounted.current
      ) {
        const data = liquidityAmount?.response?.find((item) => {
          return item.token?.toLowerCase() === currency?.address?.toLowerCase()
        })
        if (data) {
          setData(data)
        }
      }
    }
    if (currency) {
      getData()
    }
  }, [currency])

  const hasExternalData = !!Object.keys(selectedCoinInfo?.market_data ?? {})
    .length

  const internalDescription1 = internal1
    .replace('token_name', currency?.symbol)
    .replace('token_price', price ? price?.toFixed(4) : 0)
    .replace(
      'token_volume',
      new Intl.NumberFormat().format(
        weiToEthNum(new BigNumber(data?.token_volume ?? 0))
      )
    )

  const internalDescription2 = internal2
    .replace('direction', parseInt(data?.price_change) > 0 ? 'up' : 'down')
    .replace('token_name', currency?.symbol)
    .replace(
      'direction_change_in_percentage',
      data?.price_change
        ? Math.abs(parseInt(data?.price_change)?.toFixed(2) ?? 0)
        : 0
    )

  const externalDescription = hasExternalData
    ? external
        .replace('token_name', currency?.symbol)
        .replace(
          'token_market_cap',
          formatAmount(selectedCoinInfo?.market_data?.market_cap?.usd)
        )
        .replace('#', selectedCoinInfo?.market_cap_rank)
        .replace(
          'token_supply',
          formatAmount(selectedCoinInfo?.market_data?.circulating_supply)
        )
        .replace(
          'max_token_supply',
          formatAmount(selectedCoinInfo?.market_data?.max_supply)
        )
    : ''

  return (
    <div>
      {currency && (
        <>
          <Label
            weight={800}
            text="Summary"
            size="16"
            style={{ marginBottom: '11px' }}
          />
          <Label
            weight="bold"
            opacity="0.5"
            size="13"
            text={`${internalDescription1} ${
              parseInt(data?.price_change) > 0 ? internalDescription2 : ''
            } ${externalDescription}`}
          />
        </>
      )}

      {hasExternalData ? (
        <>
          <Spacer />
          <Divider />
          <Div>
            <Item>
              <Label
                text="Market Cap Rank"
                size="11"
                weight="800"
                opacity="0.5"
              />
              <Label
                text={`#${selectedCoinInfo?.market_cap_rank}`}
                size="14"
                weight="800"
              />
            </Item>
            <Item>
              <Flex>
                <Label
                  text="Market Cap"
                  size="11"
                  weight="800"
                  opacity="0.5"
                  style={{ marginRight: '12px' }}
                />
                <img
                  src={
                    selectedCoinInfo?.market_data
                      ?.market_cap_change_percentage_24h > 0
                      ? UpTriangle
                      : DownTriangle
                  }
                  height="4"
                  alt="coinInfo"
                  style={{ marginTop: '4px', marginRight: '2px' }}
                />
                <Label
                  text={`${Math.abs(
                    selectedCoinInfo?.market_data?.market_cap_change_percentage_24h?.toFixed(
                      2
                    )
                  )}%`}
                  size="11"
                  weight="800"
                  color={
                    selectedCoinInfo?.market_data
                      ?.market_cap_change_percentage_24h > 0
                      ? '#3fd69c'
                      : '#ef3d62'
                  }
                />
              </Flex>
              <Label
                text={`$${formatAmount(
                  selectedCoinInfo?.market_data?.market_cap?.usd
                )}`}
                size="14"
                weight="800"
              />
            </Item>
            <Item>
              <Flex>
                <Label
                  text="24h Volume"
                  size="11"
                  weight="800"
                  opacity="0.5"
                  style={{ marginRight: '12px' }}
                />
                <img
                  src={
                    selectedCoinInfo?.market_data?.price_change_percentage_24h <
                    0
                      ? DownTriangle
                      : UpTriangle
                  }
                  alt="triangle"
                  height="4"
                  style={{ marginTop: '5px', marginRight: '2px' }}
                />
                <Label
                  text={`${Math.abs(
                    selectedCoinInfo?.market_data?.price_change_percentage_24h?.toFixed(
                      2
                    )
                  )}%`}
                  size="11"
                  weight="800"
                  color={
                    selectedCoinInfo?.market_data?.price_change_percentage_24h >
                    0
                      ? '#3fd69c'
                      : '#ef3d62'
                  }
                />
              </Flex>
              <Label
                text={`$${formatAmount(
                  selectedCoinInfo?.market_data?.total_volume?.usd
                )}`}
                size="14"
                weight="800"
              />
            </Item>
            <Item>
              <Label
                text="24h Live Price"
                size="11"
                weight="800"
                opacity="0.5"
              />
              <Label
                text={`$${formatAmount(
                  selectedCoinInfo?.market_data?.current_price?.usd
                )}
            `}
                size="14"
                weight="800"
              />
            </Item>
            <Item>
              <Label
                text="Circulating Supply"
                size="11"
                weight="800"
                opacity="0.5"
              />
              <Label
                text={`${formatAmount(
                  selectedCoinInfo?.market_data?.circulating_supply
                )} ${selectedCoinInfo?.symbol?.toUpperCase()}`}
                size="14"
                weight="800"
              />
            </Item>
          </Div>
          <Spacer />
          <Divider />
        </>
      ) : null}
      <Spacer />
    </div>
  )
}

export default Summary

const Div = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const Item = styled.div`
  width: 33%;
  margin-top: 25px;
`
const Flex = styled.div`
  display: flex;
`
