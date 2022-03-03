import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'

const Spacer = ({ size = 'md' }) => {
  const { spacing } = useContext(ThemeContext)

  let s
  switch (size) {
    case 'xl':
      s = spacing[19]
      break
    case 'lg':
      s = spacing[6]
      break
    case 'sm':
      s = spacing[2]
      break
    case 'md':
      s = spacing[4]
    default:
      s = spacing[4]
  }

  return <StyledSpacer size={s} />
}

const StyledSpacer = styled.div`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  min-height: ${(props) => props.size}px;
  min-width: ${(props) => props.size}px;
`
export const SpacerResponsive = styled.div`
  height: ${(props) => props.size ?? '150'}px;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    height:120px;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height:90px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
      height:60px;
  `};
`

export default Spacer
