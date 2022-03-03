import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { RowHomePage, Row } from 'components/Row'
import { HomePageButton } from 'components/Button'

import StablecoinImage from 'assets/img/stable_coin.svg'

const AboutStablecoin = () => {
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const history = useHistory()
  const handleSwapNow = () => {
    history.push({
      pathname: '/swap/vUSD',
      search: `?network=${networkName}`,
      state: {
        fromHomePage: true,
      },
    })
  }
  return (
    <RowContainer>
      <Col justify="center" maxWidth="416">
        <Label>A new kind of stablecoin</Label>
        <StyledList>
          <ListItem>
            <Span>vUSD powers the protocol</Span>
          </ListItem>
          <ListItem>
            <Span>Robust and capital-efficient</Span>
          </ListItem>
          <ListItem>
            <Span>Backed by all assets in our pool</Span>
          </ListItem>
          <ListItem>
            <Span>
              Programmatically guaranteed to have no slippage and always peg to
              USD at 1:1
            </Span>
          </ListItem>
        </StyledList>
        <RowHomePage>
          <HomePageButton className="btn-press" onClick={handleSwapNow}>
            Get vUSD
          </HomePageButton>
        </RowHomePage>
      </Col>
      <Col align="flex-end">
        <img src={StablecoinImage} width="100%" alt="stablecoin" />
      </Col>
    </RowContainer>
  )
}

const RowContainer = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
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
const Label = styled.div`
  width: 352px;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.25;
  color: ${({ theme }) => theme.color.secondary.main};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  text-align: center;
  `};
`

const StyledList = styled.ul`
  max-width: 308px;
  padding-inline-start: 0;
  ${({ theme }) => theme.mediaWidth.upToMedium`
   padding-inline-start: 40px;
  `};
`
const Span = styled.span`
  opacity: 0.5;
`
const ListItem = styled.li`
  font-size: 16px;
  font-weight: 800;
  line-height: 1.44;
  color: ${({ theme }) => theme.color.secondary.main};
`
export default AboutStablecoin
