import React from 'react'
import styled from 'styled-components'

const LeftColumn = ({ children, style = {} }) => {
  return (
    <StyledLeftColumn style={style} className="leftColumn">
      {children}
    </StyledLeftColumn>
  )
}

export default LeftColumn

const StyledLeftColumn = styled.div`
  grid-area: leftColumn;
`
