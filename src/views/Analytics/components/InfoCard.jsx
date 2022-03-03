import React from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { CopyOutline } from '@styled-icons/evaicons-outline/CopyOutline'

import useWallet from 'hooks/useWallet'

import { StyledExternalLink } from 'theme'
import { getEtherscanLink } from 'monox/util'

import Label from 'components/Label'
import Spacer from 'components/Spacer'
import { Row, RowBetween } from 'components/Row'
import Button from 'components/Button'

const InfoCard = ({ currency }) => {
  const { chainId } = useWallet()
  if (currency?.symbol === 'ETH' || currency?.symbol === 'MATIC') return null
  return (
    <>
      <Row>
        <Label text="Token Information" align="left" size="24" weight="800" />
      </Row>
      <Spacer />
      <Container>
        <Col>
          <Label text="Symbol" size="14" weight="800" opacity="0.3" />
          <Label text={currency?.symbol} size="24" weight="bold" />
        </Col>
        <Col>
          <Label text="Name" size="14" weight="800" opacity="0.3" />
          <Label text={currency?.name} size="24" weight="bold" />
        </Col>
        <Col>
          <Label text="Address" size="14" weight="800" opacity="0.3" />
          <Label size="24" weight="bold" style={{ display: 'flex' }}>
            {`${currency?.address?.slice(0, 8)}...${currency?.address?.slice(
              -6
            )}`}
            <CopyIcon
              data-tip="copied"
              data-event="click"
              data-event-off="click"
              data-iscapture="true"
              onClick={() => navigator?.clipboard?.writeText(currency?.address)}
            />
            <ReactTooltip delayHide={1000} />
          </Label>
        </Col>
        <Col>
          <Shadow>
            <Button
              size="sm"
              bg="#3dcf9726"
              fontColor="primary"
              style={{ border: 'none' }}
            >
              <StyledExternalLink
                href={getEtherscanLink(chainId, currency?.address, 'token')}
                target="_blank"
              >
                {`View on ${chainId === 42 || chainId === 1 ? 'Etherscan' : 'Polygonscan'}`}
              </StyledExternalLink>
            </Button>
          </Shadow>
        </Col>
      </Container>
    </>
  )
}
const Container = styled(RowBetween)`
  padding: 38px 50px;
  border-radius: 33px;
  flex-wrap: wrap;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  ${({ theme }) => theme.mediaWidth.upToLarge`
  justify-content:space-around
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  padding:20px;
  div{
    align-items:center
  }
  `}
`
const Shadow = styled.span`
  box-shadow: 0 12px 20px 0 rgba(50, 171, 125, 0.3);
  &:hover {
    box-shadow: none !important;
  }
`

const CopyIcon = styled(CopyOutline)`
  width: 20px;
  margin-left: 8px;
  opacity: 0.5;
  color: ${({ theme }) => theme.color.secondary.main};
  cursor: pointer;
`

const Col = styled(Row)`
  flex-direction: column;
  align-items: start;
  width: auto;

  ${({ theme }) => theme.mediaWidth.upToLarge`
  margin-bottom: 15px
  `}
`
export default InfoCard
