import React from 'react'
import styled from 'styled-components'

import { Row, RowHomePage } from 'components/Row'
import Label from 'components/Label'
import { HomePageButton } from 'components/Button'

import SingleTokenPool from 'assets/img/singleTokenPool.svg'

const AboutSinglePool = () => {
  return (
    <RowContainer>
      <Col justify="center" maxWidth="416">
        <Label text="Single Token Pool" size="40" weight="800" />
        <Label
          size="16"
          weight="800"
          opacity="0.5"
          style={{ margin: '20px 0 35px 0' }}
        >
          MonoX Protocol uses one liquidity pool and groups deposited tokens
          into a virtual pair with the vUSD stablecoin.
        </Label>
        <RowHomePage>
          <HomePageButton
            style={{ marginRight: '20px' }}
            className="btn-press"
            onClick={() => {
              window.open('/pool')
            }}
          >
            Dapp
          </HomePageButton>
          <HomePageButton
            className="btn-press"
            onClick={() => {
              window.open('https://docs.monox.finance/')
            }}
          >
            Read Doc
          </HomePageButton>
        </RowHomePage>
      </Col>
      <Col align="flex-end">
        <img src={SingleTokenPool} width="100%" alt="SingleTokenPool" />
      </Col>
    </RowContainer>
  )
}

const RowContainer = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  text-align:center
  `};
`

const Col = styled(Row)`
  flex-direction: column;
  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};
  max-width: ${(props) => props.maxWidth}px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  justify-content: center;
  align-items: center;
  `};
`

export default AboutSinglePool
