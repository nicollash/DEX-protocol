import React from 'react'
import styled, { keyframes } from 'styled-components'

const Modal = ({ children, width, maxWidth }) => {
  return (
    <StyledResponsiveWrapper width={width}>
      <StyledModal maxWidth={maxWidth}>{children}</StyledModal>
    </StyledResponsiveWrapper>
  )
}

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`

export const StyledResponsiveWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow-y: auto;
  width: ${(props) => props.width ?? '450'}px;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
    flex: 1;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    max-height: calc(100% - ${(props) => props.theme.spacing[4]}px);
    animation: ${mobileKeyframes} 0.3s forwards ease-out;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 400px
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 350px
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 300px
  `}
`

export const StyledModal = styled.div`
  padding: 40px;
  background: ${({ theme }) => theme.color.background.main};
  box-sizing: border-box;
  border-radius: 39px;
  box-shadow: inset 1px 1px 0px ${(props) => props.theme.color.grey[100]};
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     padding: 30px;
  `}
`

export default Modal
