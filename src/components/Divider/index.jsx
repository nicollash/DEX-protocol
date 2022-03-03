import React from 'react'
import styled from 'styled-components'

const Divider = ({ style = {} }) => {
  return (
    <Container style={style}>
      <Div1 />
      <Div2 />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Div1 = styled.div`
  opacity: 0.15;
  height: 1px;
  background: ${(props) => props.theme.color.seperator.top};
  width: 100%;
`

const Div2 = styled.div`
  height: 1px;
  background: ${(props) => props.theme.color.seperator.bottom};
  width: 100%;
`
export default Divider
