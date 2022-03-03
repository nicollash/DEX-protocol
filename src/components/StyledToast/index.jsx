import React from 'react'
import styled from 'styled-components'

import { Cross } from '@styled-icons/entypo/Cross'

const StyledToast = ({ closeToast, children }) => {
  return (
    <Div>
      {children}
      <Close color="#fff" size="24" onClick={closeToast} />
    </Div>
  )
}

export default StyledToast

const Div = styled.div`
  display: flex;
  align-items: flex-start;
`

const Close = styled(Cross)`
  color: #fff;
  margin-left: 8px;
  margin-top: -7px;
`
