import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import { weiToEthNum } from 'monox/constants'
import { precise } from 'monox/util'
import config from 'monox/config'
import useWallet from 'hooks/useWallet'
import theme from 'theme'

import { getPriceChanges } from 'api'

import { Row } from 'components/Row'
import TokenImage from 'components/TokenImage'
import Spacer from 'components/Spacer'
import Label from 'components/Label'
import Button from 'components/Button'

const Header = ({ currency, pool }) => {
  const history = useHistory()
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const networkName = config[networkId || chainId].NAME.toLowerCase()
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS
  const price = weiToEthNum(BigNumber(pool?.price))
  const [priceChanges, setPriceChanges] = useState([])

  const changeRoute = (route) => {
    history.push({
      pathname: route,
      search: `?network=${networkName}`,
      state: { setAsReceiving: true },
    })
  }

  const getTokenPriceChanges = async () => {
    try {
      const priceChangeData = await getPriceChanges(
        chainId,
        currency?.address || WRAPPED_MAIN_ADDRESS
      )
      setPriceChanges(priceChangeData?.response)
    } catch (err) {
      setPriceChanges([])
    }
  }

  useEffect(() => {
    if (chainId && currency) {
      getTokenPriceChanges()
    }
  }, [chainId, currency?.address])

  return (
    <Container>
      <Col style={{ width: '110%' }}>
        <Label
          size="32"
          weight="bold"
          style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <TokenImage
            src={currency?.logoURI}
            letter={currency?.symbol && currency?.symbol[0]}
          />
          <Spacer size="sm" />
          {currency?.name} <Spacer size="sm" />({currency?.symbol})
          <Spacer />
          {price !== 0 && (
            <>
              <Label
                text={`${
                  price < 0.0001
                    ? '< $ 0.0001'
                    : `$${new Intl.NumberFormat().format(precise(price, 4))}`
                }`}
                size="24"
                weight="bold"
              />
              <Spacer />
              <Label
                style={{
                  color:
                    priceChanges[0]?.price_change < 0
                      ? 'rgb(255, 101, 109)'
                      : theme.color.font.primary,
                }}
                text={`$${new Intl.NumberFormat().format(
                  precise(priceChanges[0]?.net_price_change / 10 ** 18, 4 ?? 0)
                )}(${new Intl.NumberFormat().format(
                  precise(priceChanges[0]?.price_change, 4 ?? 0)
                )}%)`}
                size="16"
                primary
                weight="800"
              />
            </>
          )}
        </Label>
      </Col>
      <Col justify="flex-end" style={{ width: '90%' }}>
        <Button
          size="sm"
          bg="#3dcf9726"
          fontColor="primary"
          style={{ border: 'none' }}
          onClick={() =>
            changeRoute(
              `/swap/${
                currency?.notInList ? currency?.address : currency?.symbol
              }`
            )
          }
        >
          Swap
        </Button>
        {price !== 0 && (
          <>
            <Spacer />
            <Button
              size="sm"
              bg="#3dcf9726"
              fontColor="primary"
              style={{ border: 'none' }}
              onClick={() =>
                changeRoute(
                  `/add/${
                    currency?.notInList ? currency?.address : currency?.symbol
                  }`
                )
              }
            >
              Add Liquidity
            </Button>
          </>
        )}
      </Col>
    </Container>
  )
}

const Col = styled(Row)`
  justify-content: ${(props) => props.justify};
  line-height: 50px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: column;
  `}
`
const Container = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  `}
`
export default Header
