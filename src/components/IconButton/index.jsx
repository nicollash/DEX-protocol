import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { QuestionMarkCircleOutline } from '@styled-icons/evaicons-outline/QuestionMarkCircleOutline'
import { QuestionMark } from '@styled-icons/boxicons-regular/QuestionMark'
import { QuestionCircleFill } from '@styled-icons/bootstrap/QuestionCircleFill'
import { Cross } from '@styled-icons/entypo/Cross'

const IconButton = ({ children, disabled, onClick, to }) => {
  return (
    <StyledButton disabled={disabled} onClick={onClick}>
      {!!to ? <StyledLink to={to}>{children}</StyledLink> : children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  align-items: center;
  background-color: ${(props) => props.theme.color.grey[200]};
  border: 0;
  border-radius: 28px;
  box-shadow: 6px 6px 12px ${(props) => props.theme.color.grey[300]},
    -12px -12px 24px ${(props) => props.theme.color.grey[100]}aa;
  color: ${(props) =>
    !props.disabled
      ? props.theme.color.primary.main
      : props.theme.color.grey[400]};
  cursor: pointer;
  display: flex;
  font-weight: 700;
  height: 56px;
  justify-content: center;
  letter-spacing: 1px;
  outline: none;
  padding: 0;
  margin: 0;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  text-transform: uppercase;
  width: 56px;
  &:hover {
    background-color: ${(props) => props.theme.color.grey[100]};
  }
`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`

export const QuestionCircleIcon = styled(QuestionMarkCircleOutline)`
  height: 13px;
  width: 13px;
  color: #384474;
  margin-left: 6px;
  cursor: ${(props) => props.pointer && 'pointer'};
`
export const QuestionCircleFillIcon = styled(QuestionCircleFill)`
  height: 13px;
  width: 13px;
  color: ${(props) => props.theme.color.button.main};
  margin-left: 6px;
  cursor: ${(props) => props.pointer && 'pointer'};
`

export const UnknownTokenIcon = styled(QuestionMark)`
  height: ${(props) => props.height ?? '40'}px;
  width: ${(props) => props.width ?? '40'}px;
`

export const CloseIcon = styled(Cross)`
  height: ${(props) => props.size ?? 24}px;
  width: ${(props) => props.size ?? 24}px;
  cursor: pointer;
  color: ${({ theme }) => theme.color.secondary.main};
  opacity: 0.5;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
  }
`

export default IconButton
