import React from 'react'
import styled from 'styled-components'

const Page = ({ children, style = {} }) => (
  <StyledMain style={style} className="page">
    {children}
  </StyledMain>
)

const StyledMain = styled.div`
  display: grid;
  max-width: 1143px;
  grid-template-columns: auto 390px;
  grid-template-rows: auto auto;
  margin: auto;
  gap: 1.5rem 6.875rem;
  grid-template-areas:
    'leftColumn rightColumn'
    'recentTrades rightColumn';
  padding: 2rem;
  padding-top: 0;
  ${({ theme }) => theme.mediaWidth.upToMedium`
   grid-template-columns: minmax(320px, 0.75fr);
    padding: 1rem;
    justify-content: center;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      'leftColumn'
      'rightColumn'
      'recentTrades';
  `}
`

export default Page
