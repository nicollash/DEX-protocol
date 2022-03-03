import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import {
  QuestionCircleIcon,
  QuestionCircleFillIcon,
} from 'components/IconButton'

const QuestionHelper = ({ text, id }) => {
  const [active, setActive] = useState(false)
  const Tooltip = ({ ...props }) => (
    <StyledTooltip
      multiline
      {...props}
      arrowColor="transparent"
      afterShow={() => setActive(true)}
      afterHide={() => setActive(false)}
    />
  )

  return (
    <>
      {active ? (
        <QuestionCircleFillIcon pointer data-tip data-for={id} />
      ) : (
        <QuestionCircleIcon pointer data-tip data-for={id} />
      )}

      <Tooltip id={id} effect="solid" place="right">
        <div style={{ margin: '10px 15px' }}>{text}</div>
      </Tooltip>
    </>
  )
}

export default QuestionHelper

const StyledTooltip = styled(ReactTooltip)`
  border-radius: 12px !important;
  padding: 0px !important;
  font-size: 12px !important;
  font-weight: bold !important;
  color: rgb(33, 45, 99, 0.5) !important;
  opacity: 1 !important;
  max-width: 250px;
  ${(props) => props.theme.inputFocusBorder}
  box-shadow: 0 18px 30px 0 #d1d9e6 !important;
`
