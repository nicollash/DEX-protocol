import React from 'react'
import styled from 'styled-components'

const Card = ({ children, style = {} }) => (
  <StyledCard style={style}>{children}</StyledCard>
)

const StyledCard = styled.div`
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
`

export const LightCard = styled(StyledCard)`
  border: 1px solid #f7f8fa;
  background-color: #ffffff;
  box-shadow: none;
`
export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export default Card
