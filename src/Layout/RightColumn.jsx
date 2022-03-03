import React from 'react'
import styled from 'styled-components'

const RightColumn = ({ children }) => {
  return (
    <StyledRightColumn className="rightColumn">{children}</StyledRightColumn>
  )
}

export default RightColumn

const StyledRightColumn = styled.div`
  grid-area: rightColumn;
`
