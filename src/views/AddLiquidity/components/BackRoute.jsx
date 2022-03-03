import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'

import { RowBetween } from 'components/Row'
import Label from 'components/Label'

export function BackRoute({ adding, creating, link = '', settings = null }) {
  const networkName = useSelector(({ network }) => network.NAME)?.toLowerCase()

  return (
    <Tabs>
      <RowBetween style={{ alignItems: 'center' }}>
        <NavLink
          to={link || `/pool?network=${networkName}`}
          style={{ height: 24 }}
        >
          <StyledArrowLeft />
        </NavLink>
        <Label weight={800} size={18} style={{ margin: 'auto' }}>
          {creating
            ? 'Create a pool'
            : adding
            ? 'Add Liquidity'
            : 'Remove Liquidity'}
        </Label>
        {settings}
      </RowBetween>
    </Tabs>
  )
}

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.color.secondary.main};
`

const Tabs = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 8px;
  justify-content: space-evenly;
`
