import React from 'react'
import styled from 'styled-components'

import Label from 'components/Label'
import { Row } from 'components/Row'

import waveFront from 'assets/img/wave-front.svg'
import waveBack from 'assets/img/wave-back.svg'

const ChartPlaceholder = ({ text, style = {} }) => {
  return (
    <Container style={style}>
      <Div>
        <Label
          text={text}
          size="18"
          weight="800"
          opacity={0.3}
          style={{ padding: 20 }}
        />
      </Div>
      <Wave className="wave" />
      <Wave2 className="wave" />
    </Container>
  )
}

export default ChartPlaceholder

const Container = styled(Row)`
  background: rgba(65, 222, 162, 0.03);
  border-radius: 15px;
  height: 410px;
  position: relative;
  overflow: hidden;
`
const Div = styled(Row)`
  margin-top: -140px;
  align-items: center;
  justify-content: center;
`

const Wave = styled.div`
  background: url(${waveFront}) repeat-x;
  position: absolute;
  bottom: 0;
  width: 100000px;
  height: 166px;
  background-size: contain;
  animation: wave 60s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
  transform: translate3d(0, 0, 0);
`
const Wave2 = styled.div`
  left: 40px;
  background: url(${waveBack}) repeat-x;
  position: absolute;
  bottom: 0;
  width: 100000px;
  height: 166px;
  background-size: contain;
  animation: wave 60s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite,
    swell 5s ease -1.25s infinite;
  transform: translate3d(0, 0, 0);
`
