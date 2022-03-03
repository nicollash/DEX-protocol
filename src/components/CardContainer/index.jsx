import React from 'react'
import styled from 'styled-components'

const CardContainer = ({ children, top, maxWidth, style = {} }) => {
  return (
    <Container top={top} style={style} maxWidth={maxWidth}>
      {children}
    </Container>
  )
}

export default CardContainer

export const PoolContainer = styled.div`
  margin: auto;
  max-width: 550px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.background.main};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 80%;
  margin-top:0
  `}
`

const Container = styled.div`
  padding: ${(props) => (props.maxWidth ? '0px' : '41px 50px 45px 50px')};
  margin: auto;
  margin-top: ${(props) => `${props?.top}px` ?? '100px'};
  position: relative;
  max-width: ${(props) => props.maxWidth ?? '450'}px;
  border-radius: 39px;
  box-shadow: ${({ theme }) => theme.shadows.thin};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 30px 25px;
    margin: unset
  `}
`
