import React from 'react'
import styled from 'styled-components'

import { DiagonalArrowRightDownOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightDownOutline'
import { DiagonalArrowRightUpOutline } from '@styled-icons/evaicons-outline/DiagonalArrowRightUpOutline'
import { MinusOutline } from '@styled-icons/evaicons-outline/MinusOutline'

import { precise } from 'monox/util'
import Label from 'components/Label'
import { Row } from 'components/Row'

const OneDayData = ({ oneDay }) => {
  return (
    <Row>
      {oneDay == undefined || parseFloat(oneDay) === 0 ? (
        <Minus />
      ) : oneDay < 0 ? (
        <DownRight />
      ) : (
        <UpRight />
      )}
      <Label
        text={`${
          oneDay == undefined || parseFloat(oneDay) === 0
            ? 0
            : parseFloat(oneDay).toPrecision(1) < 1
            ? parseFloat(oneDay).toFixed(5)
            : new Intl.NumberFormat().format(precise(oneDay, 2 ?? 0))
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

export default OneDayData
