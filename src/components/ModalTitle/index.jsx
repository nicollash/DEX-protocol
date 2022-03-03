import React from 'react'
import styled from 'styled-components'

const ModalTitle = ({ text, height }) => (
  <StyledModalTitle height={height}>{text}</StyledModalTitle>
)

const StyledModalTitle = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.color.secondary.main};
  display: flex;
  font-size: 18px;
  font-weight: 800;
  height: ${(props) =>
    props.height ? props.height : props.theme.topBarSize}px;
  justify-content: ${(props) => (props.justify ? props.justify : 'center')};
`

export default ModalTitle
