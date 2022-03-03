import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { uriToHttp } from 'monox/getTokenList'
import { precise } from 'monox/util'
import usePool from 'hooks/usePool'
import useWallet from 'hooks/useWallet'

import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import { RowBetween, RowFixed } from 'components/Row'
import Divider from 'components/Divider'
import config from 'monox/config'

const PositionCard = ({ currency, showBalance = true }) => {
  const { chainId } = useWallet()
  const networkId = useSelector(({ network }) => network.id)
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS

  const vUSDData = config[networkId || chainId].vUSD
  const {
    pool,
    pooledAmount,
    vusdOut,
    sharedPercent,
    balance,
    vusdBalance,
  } = usePool(currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS))

  const getCorrectAmount = (decimals, amount) => {
    if (decimals && amount) {
      return amount * Math.pow(10, 18 - parseInt(decimals))
    } else {
      return 0
    }
  }

  return (
    <Div>
      <Row>
        <Col>
          <Image data={currency}>
            <TokenImage
              src={uriToHttp(currency?.logoURI)[0]}
              height="40"
              width="40"
              style={{ zIndex: '1' }}
              letter={currency?.symbol && currency?.symbol[0]}
            />
            {vusdBalance > 0 ? (
              <TokenImage
                src={uriToHttp(vUSDData?.logoURI)}
                letter={vUSDData?.symbol && vUSDData?.symbol[0]}
                height="40"
                width="40"
                style={{ marginLeft: -10 }}
              />
            ) : (
              ''
            )}
            <Symbol>
              <Label text={`${currency?.symbol} LP`} size={18} weight={800} />
            </Symbol>
          </Image>
        </Col>
        <Col>
          <Label text={pool && precise(balance, 6)} size={18} weight={800} />
        </Col>
      </Row>
      <Divider />
      {!showBalance && (
        <>
          <Row>
            <Col>
              <Label
                text="Your Pool Share"
                opacity={0.5}
                size={14}
                weight={800}
              />
            </Col>
            <Col>{precise(sharedPercent, 2)}%</Col>
          </Row>
          <Divider />
          <Row>
            <Col>
              <Label
                text={currency?.symbol}
                opacity={0.5}
                size={14}
                weight={800}
              />
            </Col>
            <Col>
              {pooledAmount
                ? precise(getCorrectAmount(currency?.decimals, pooledAmount), 6)
                : '-'}
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col>
              <Label text={'vUSD'} opacity={0.5} size={14} weight={800} />
            </Col>
            <Col>{vusdOut ? precise(vusdOut, 6) : '-'}</Col>
          </Row>
          <Divider />
        </>
      )}
    </Div>
  )
}

const Div = styled.div`
  margin-top: 45px;
  margin-bottom: 3rem;
  width: 100%;
`
const Symbol = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
  margin-left: 16px;
`
const Image = styled.div`
  display: flex;
  align-items: center;
`
const Row = styled(RowBetween)`
  padding: 18px 0 19px 0;
`
const Col = styled(RowFixed)`
  align-items: center;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
`
export default PositionCard
