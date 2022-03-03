import React from 'react'
import styled from 'styled-components'

import { AutoColumn } from 'components/Column'

const InfoCard = ({ text }) => {
  return (
    <AutoColumn gap="10px">
      <Info>
        <b>Tip:</b> {text}
      </Info>
    </AutoColumn>
  )
}

export default InfoCard

const Info = styled.div`
  box-sizing: border-box;
  color: rgb(255, 0, 122);
  font-weight: 400;
  background: rgb(253, 234, 241);
  padding: 1.25rem;
  border-radius: 12px;
`
