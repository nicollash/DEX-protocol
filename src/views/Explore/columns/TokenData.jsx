import React from 'react'
import styled from 'styled-components'

import Label from 'components/Label'
import TokenImage from 'components/TokenImage'
import { RowClickable, RowFixed } from 'components/Row'

const TokenData = ({ handleAnalytics, image, name, symbol, token }) => {
  return (
    <RowClickable onClick={() => handleAnalytics(token)}>
      <Col icon>
        <TokenImage
          src={image?.url || image}
          width="20"
          height="20"
          letter={symbol && symbol[0]}
        />
      </Col>
      <Col last>
        <Label text={name} size="13" weight="800" />
        <Label
          text={symbol}
          size="12"
          weight="bold"
          opacity="0.5"
          style={{ marginLeft: 'auto', paddingLeft: '10px' }}
        />
      </Col>
    </RowClickable>
  )
}

const Col = styled(RowFixed)`
  margin-left: ${(props) => props.last && '13px'};
  min-width: ${(props) => props.last && '160px'};
`

export default TokenData
