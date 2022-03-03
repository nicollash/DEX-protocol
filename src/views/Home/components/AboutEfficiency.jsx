import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { Row, RowHomePage } from 'components/Row'
import { HomePageButton } from 'components/Button'

import EfficincyImage from 'assets/img/efficiency.svg'

const AboutEfficiency = () => {
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()
  const history = useHistory()
  const handleSwapNow = () => {
    history.push(`/swap?network=${networkName}`)
  }

  return (
    <RowContainer>
      <Col>
        <img src={EfficincyImage} width="100%" alt="EfficincyImage" />
      </Col>
      <Col justify="center" maxWidth="416">
        <Label>DeFi with greater capital efficiency</Label>
        <StyledList>
          <ListItem>
            <Span>Lower trading fees </Span>
          </ListItem>
          <ListItem>
            <Span>As a project - launch new tokens with zero capital</Span>
          </ListItem>
          <ListItem>
            <Span>Less capital required to be a Liquidity Provider</Span>
          </ListItem>
          <ListItem>
            <Span>Less siloed capital in multiple pool pairs</Span>
          </ListItem>
        </StyledList>
        <RowHomePage>
          <HomePageButton className="btn-press" onClick={handleSwapNow}>
            Swap Now
          </HomePageButton>
        </RowHomePage>
      </Col>
    </RowContainer>
  )
}

const RowContainer = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
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

const StyledList = styled.ul`
  max-width: 413px;
`

const ListItem = styled.li`
  font-size: 16px;
  font-weight: 800;
  line-height: 1.44;
  color: ${({ theme }) => theme.color.secondary.main};
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
const Span = styled.span`
  opacity: 0.5;
`
export default AboutEfficiency
