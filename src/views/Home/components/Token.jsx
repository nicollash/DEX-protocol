import React from 'react'
import styled from 'styled-components'

import StyledIconButton from 'components/StyledIconButton'
import { ColumnCenter } from 'components/Column'
import Label from 'components/Label'

import Ethereum from 'assets/img/ethereum.png'
import Aeternity from 'assets/img/aeternity.png'
import Monero from 'assets/img/monero.png'
import Tron from 'assets/img/tron.png'

const Token = () => {
  const TokenCard = ({ src, tx1, tx2, tx3 }) => (
    <Container>
      <Content>
        <Image src={src} />
        <Label
          text={tx1}
          size="16"
          weight="800"
          style={{ marginTop: '30px' }}
        />
        <Label text={tx2} size="20" weight="800" />
        <Label text={tx3} size="16" weight="800" opacity="0.5" />
      </Content>
    </Container>
  )
  return (
    <>
      <Grid>
        <TokenCard src={Ethereum} tx1="TOKEN" tx2="$1,000.00" tx3="+0.00%" />
        <TokenCard src={Aeternity} tx1="TOKEN" tx2="$1,000.00" tx3="+0.00%" />
        <TokenCard src={Monero} tx1="TOKEN" tx2="$1,000.00" tx3="+0.00%" />
        <TokenCard src={Tron} tx1="TOKEN" tx2="$1,000.00" tx3="+0.00%" />
      </Grid>
      <ColumnCenter>
        <StyledIconButton variant="primary" icon="arrow">
          Explore All
        </StyledIconButton>
      </ColumnCenter>
    </>
  )
}

const Container = styled.div`
  transform: skew(0deg, 7deg);
  width: 208px;
  height: 265px;
  border-radius: 38px;
  box-shadow: 18px 18px 30px 0 #d1d9e6, -4px -4px 4px 0 #f6f8fe;
  margin: 15px;
  margin-bottom: 100px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
     margin-bottom: 70px;
  `}
`
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`
const Image = styled.img`
  position: absolute;
  top: -35px;
  left: 50px;
`
const Content = styled.div`
  transform: skew(0deg, -7deg);
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`
export default Token
