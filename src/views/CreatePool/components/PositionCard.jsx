import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import usePool from 'hooks/usePool'
import { precise } from 'monox/util'

import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import { RowBetween, RowFixed } from 'components/Row'

const PositionCard = ({ currency, lpTokenAmount, showBalance = true }) => {
  const WRAPPED_MAIN_ADDRESS = config[networkId || chainId].WRAPPED_MAIN_ADDRESS

  const { pool, balance, sharedPercent } = usePool(
    currency?.address || (!!currency?.symbol && WRAPPED_MAIN_ADDRESS)
  )

  return (
    <Div>
      <Label text={'Your Position'} size={16} weight={800} />
      <Row>
        <Col>
          <Image data={currency}>
            <TokenImage src={currency?.logoURI} height="45" width="45" />
            <Symbol>
              {currency?.symbol}
              {!showBalance && ' LP Token'}
            </Symbol>
          </Image>
        </Col>
        <Col>{lpTokenAmount}</Col>
      </Row>
      {!showBalance && (
        <>
          <Row>
            <Col>Your Pool Share</Col>
            <Col>{precise(sharedPercent, 2)}%</Col>
          </Row>
          <Row>
            <Col>{currency?.symbol}</Col>
            <Col>{pool ? balance : '-'}</Col>
          </Row>
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
  padding: 16px 0;
  ${(props) => (props.last ? 'border:none' : 'border-bottom:1px solid #d7dee8')}
`
const Col = styled(RowFixed)`
  align-items: center;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.secondary.main};
`
export default PositionCard
