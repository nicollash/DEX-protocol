import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import usePoolList from 'hooks/usePoolList'
import useTokenMetrics from 'hooks/useTokenMetrics'
import { usePrismic } from 'hooks/usePrismic'
import { precise } from 'monox/util'
import { weiToEthNum } from 'monox/constants'

import { DiagonalArrowRightDownOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightDownOutline'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'

import { RowFixed, Row } from 'components/Row'
import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import StyledDataTable from 'components/StyledDataTable'

function YieldFarmingTable({ collections }) {
  const [data, setData] = useState([])
  const { poolList, loading } = usePoolList()
  const { tokensById } = usePrismic(true)
  const { allTokenMetrics } = useTokenMetrics()
  const tokens = collections?.yield_farming?.tokens
  const arrayToObject = (array) =>
    array.reduce((obj, item) => {
      obj[item?.token] = item
      return obj
    }, {})

  const poolDataList = arrayToObject(poolList)

  useEffect(() => {
    if (Array.isArray(tokens) && tokensById) {
      const tempData = tokens.map((token) => {
        const prismicData = tokensById[token.token.id]
        const poolData =
          prismicData && poolDataList
            ? poolDataList[prismicData.contract_id]
            : {}
        const metricsData = poolData ? allTokenMetrics[poolData.token] : {}
        return {
          ...token,
          token_name: prismicData?.name,
          token_symbol: prismicData?.symbol,
          token_price: weiToEthNum(BigNumber(poolData?.price)),
          token_price_change: metricsData?.price_change || 0,
          token_img: prismicData?.image?.url,
          token_liquidity: weiToEthNum(
            BigNumber(metricsData?.liquidity_amount_volume)
          ),
        }
      })
      setData(tempData)
    }
  }, [poolList, tokens, tokensById, allTokenMetrics])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Token',
        accessor: 'token_name',
        style: { width: '20%' },

        Cell: function tokenRow({ row }) {
          const { token_name, token_img, token_symbol } = row.original
          return (
            <Row>
              <Col icon>
                <TokenImage
                  src={token_img}
                  width="45"
                  height="45"
                  letter={token_symbol && token_symbol[0]}
                />
              </Col>
              <Col last>
                <Label text={token_name} size="13" weight="800" />
              </Col>
            </Row>
          )
        },
      },
      {
        Header: 'Symbol',
        accessor: 'token_symbol',
        style: { width: '13%' },

        Cell: function symbolRow({ row }) {
          const { token_symbol } = row.original
          return <Label text={token_symbol} size="13" weight="800" />
        },
      },
      {
        Header: 'Price',
        accessor: 'token_price',
        style: { width: '13%' },
        Cell: function priceRow({ row }) {
          const { token_price } = row.original
          return (
            <Label
              text={`$${precise(token_price, 6)}`}
              size="13"
              weight="800"
            />
          )
        },
      },
      {
        Header: 'Last 24h',
        accessor: 'Last 24h',
        style: { width: '11%' },

        Cell: function dayRow({ row }) {
          const { token_price_change } = row.original
          return (
            <Row>
              {parseInt(token_price_change) < 0 ? <DownRight /> : <UpRight />}
              <Label text={`${token_price_change}%`} size="13" weight="800" />
            </Row>
          )
        },
      },
      {
        Header: 'Liquidity',
        accessor: 'Liquidity',
        style: { width: '14%' },
        Cell: function volumnRow({ row }) {
          const { token_liquidity } = row.original
          return (
            <Label
              text={`${precise(token_liquidity, 6)}`}
              size="13"
              weight="800"
            />
          )
        },
      },
    ],
    []
  )

  return (
    <StyledDataTable
      columns={columns}
      data={data}
      full
      justify="center"
      pagination
      loading={loading}
      sortOptions={{
        sortBy: [
          {
            id: 'token_name',
            desc: false,
          },
        ],
      }}
    />
  )
}

const Col = styled(RowFixed)`
  flex-direction: column;
  justify-content: center;
  margin-left: ${(props) => props.last && '15px'};
`

const Image = styled.img`
  border-radius: 50%;
  width: 45px;
  height: 45px;
`
const UpRight = styled(DiagonalArrowRightUpOutline)`
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: ${(props) => props.theme.color.button.main};
`

const DownRight = styled(DiagonalArrowRightDownOutline)`
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: ${(props) => props.theme.color.button.light};
`
export default YieldFarmingTable
