import React from 'react'
import styled from 'styled-components'
import { DiagonalArrowRightDownOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightDownOutline'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'
import { MinusOutline } from '@styled-icons/evaicons-outline/MinusOutline'

import { precise } from 'monox/util'
import Label from 'components/Label'
import { Row } from 'components/Row'

const OneHourData = ({ oneHour }) => {
  return (
    <Row>
      {oneHour == undefined || parseFloat(oneHour) === 0 ? (
        <Minus />
      ) : oneHour < 0 ? (
        <DownRight />
      ) : (
        <UpRight />
      )}
      <Label
        text={`${
          oneHour == undefined || parseFloat(oneHour) === 0
            ? 0
            : parseFloat(oneHour).toPrecision(1) < 1
            ? parseFloat(oneHour).toFixed(5)
            : new Intl.NumberFormat().format(precise(oneHour, 2 ?? 0))
        }%`}
        size="13"
        weight="800"
      />
    </Row>
  )
}

const Minus = styled(MinusOutline)`
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: ${(props) => props.theme.color.button.main};
`

const UpRight = styled(DiagonalArrowRightUpOutline)`
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: ${(props) => props.theme.color.button.main};
`

const DownRight = styled(DiagonalArrowRightDownOutline)`
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: ${(props) => props.theme.color.button.light};
`

export default OneHourData
