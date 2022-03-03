import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import useSearchToken from 'hooks/useSearchToken'
import { weiToEthNum } from 'monox/constants'
import { uriToHttp } from 'monox/getTokenList'
import { precise, poolValue } from 'monox/util'
import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import { RowFixed, Row } from 'components/Row'

const Card = ({ title, content, per, type, pool }) => (
  <CardContainer>
    <Label text={title} opacity="0.3" size="14" weight="800" />
    <Label
      text={content}
      weight="bold"
      size="24"
      style={{ maring: '5px 0 10px 0' }}
    />
    {per > 0 && <Label text={`${per}%`} weight="800" size="16" primary />}
  </CardContainer>
)

const PriceData = ({ pool }) => {
  const vUSDData = useSelector(({ network }) => network.vUSD)

  const [token, setToken] = useState({})
  const { address } = useParams()
  const { onGetToken } = useSearchToken()
  const price = weiToEthNum(BigNumber(pool?.price))

  useEffect(() => {
    if (address) {
      const indexToRemove = address?.indexOf('?')
      onGetToken(
        indexToRemove > 0 ? address.substring(0, indexToRemove) : address
      )
        .then((res) => {
          setToken(res[0])
        })
        .catch((err) => console.log(err))
    }
  }, [address, onGetToken])

  return (
    <div>
      <Row style={{ marginBottom: '18px' }}>
        <RowFixed>
          <TokenImage
            src={`${
              address === '0xEa9f04b2806b60aA97309eE3D44F48A84034baA8' ||
              address === '0xbec564c3a5a74587e401ba6765163d57890472de'
                ? vUSDData.logoURI
                : uriToHttp(token?.logoURI)[0]
            }`}
            height="30"
            width="30"
            style={{ marginRight: '10px' }}
            letter={token?.symbol?.[0]}
          />
        </RowFixed>
        <RowFixed style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Label
            text={`1 ${token?.symbol} = ${precise(price, 3)} vUSD`}
            size="12"
            weight="800"
          />
          <Label
            text={`$${precise(price, 3)}`}
            size="12"
            weight="800"
            opacity="0.3"
          />
        </RowFixed>
      </Row>
      <Row>
        <RowFixed>
          <TokenImage
            src={`${vUSDData.logoURI}`}
            height="30"
            width="30"
            style={{ marginRight: '10px' }}
          />
        </RowFixed>
        <RowFixed style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Label
            text={`1 vUSD = ${precise(1 / precise(price, 6), 3)} ${
              token?.symbol
            }`}
            size="12"
            weight="800"
          />
          <Label text="$1.00" size="12" weight="800" opacity="0.3" />
        </RowFixed>
      </Row>
    </div>
  )
}

const DataCard = ({ currency, pool, sharedPercent, data }) => {
  const price = weiToEthNum(BigNumber(pool?.price))
  const tokenBalance = weiToEthNum(BigNumber(pool?.tokenBalance))
  const vusdBalance = weiToEthNum(BigNumber(pool?.vusdCredit - pool?.vusdDebt))
  const poolBalance = poolValue(vusdBalance, tokenBalance, price)

  const volumn = useMemo(() => {
    if (data) {
      const volumnIn = weiToEthNum(BigNumber(data.VolumeIn))
      const volumnOut = weiToEthNum(BigNumber(data.VolumeOut))
      return volumnIn + volumnOut
    }
    return 0
  }, [data])

  const fee = useMemo(() => {
    if (data) {
      return weiToEthNum(BigNumber(data.fee))
    }
    return 0
  }, [data])

  return (
    <Grid>
      {vusdBalance > 0 && (
        <Card
          title="Total Value Locked (TVL)"
          content={`$${new Intl.NumberFormat().format(
            precise(poolBalance, 4)
          )}`}
          per={precise(sharedPercent, 2)}
        />
      )}

      <Card
        title="Volume (24hrs)"
        content={`$${new Intl.NumberFormat().format(precise(volumn, 4))}`}
        per={0}
      />
      <Card
        title="Fees (24hrs)"
        content={`$${new Intl.NumberFormat().format(precise(fee, 4))}`}
        per={0}
      />
      {price !== 0 && (
        <CardContainer>
          <PriceData pool={pool} currency={currency} />
        </CardContainer>
      )}
    </Grid>
  )
}

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`
const CardContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 240px;
  min-height: 134px;
  border-radius: 38px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  margin: 13px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 20px;
  `};
`

export default DataCard
