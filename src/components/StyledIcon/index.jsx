import React, { useState } from 'react'
import styled from 'styled-components'

import SwapIcon from 'assets/img/swap.svg'
import SwapHoverIcon from 'assets/img/swap-hover.svg'
import SettingIcon from 'assets/img/settings.svg'
import SettingHoverIcon from 'assets/img/settings-hover.svg'
import ChevronIcon from 'assets/img/chevron.svg'
import ChevronHoverIcon from 'assets/img/chevron-hover.svg'

const IconContainer = ({
  icon,
  iconHover,
  onClick,
  style = {},
  isSwapped,
  disabled = false,
  active = false,
  testid = 'icon-container',
}) => {
  const [hovered, setHovered] = useState(false)
  return (
    <MainIconContainer style={style}>
      <StyledIconContainer
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(active ? true : false)}
        active={active}
        hovered={hovered}
      >
        <StyledIconInnerContainer
          onClick={onClick}
          disabled={disabled}
          active={active}
          hovered={hovered}
          data-testid={testid}
        >
          {hovered ? (
            <Icon src={iconHover} isSwapped={isSwapped} />
          ) : (
            <Icon src={icon} isSwapped={isSwapped} />
          )}
        </StyledIconInnerContainer>
      </StyledIconContainer>
    </MainIconContainer>
  )
}

export const StyledSwapIcon = ({
  isSwapped,
  onClick,
  style,
  disabled,
  testid = 'swap-icon-container',
}) => (
  <IconContainer
    style={style}
    icon={SwapIcon}
    iconHover={SwapHoverIcon}
    isSwapped={isSwapped}
    onClick={onClick}
    disabled={disabled}
    testid={testid}
  />
)

export const StyledSettingIcon = ({ style, onClick, disabled, active }) => (
  <IconContainer
    icon={SettingIcon}
    iconHover={SettingHoverIcon}
    style={style}
    onClick={onClick}
    disabled={disabled}
    active={active}
  />
)

export const StyledChevronIcon = ({ style, isSwapped, disabled }) => (
  <IconContainer
    style={style}
    isSwapped={isSwapped}
    iconHover={ChevronHoverIcon}
    icon={ChevronIcon}
    disabled={disabled}
  />
)

const MainIconContainer = styled.div`
  display: flex;
`

const StyledIconContainer = styled.div`
  box-shadow: ${(props) =>
    props.active || props.hovered
      ? ''
      : `8px 8px 20px 0 #d0d8e6, -8px -8px 20px 0 #ffffff,
        -1px -1px 3px 0 #ffffff`};
  border-radius: 100%;
  width: fit-content;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const StyledIconInnerContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 32px;
  height: 32px;
  outline: none;
  background-color: ${({ theme }) => theme.color.background.main};
  border: none;
  box-shadow: ${(props) =>
    props.hovered
      ? `8px 8px 20px 0 #d0d8e6, -8px -8px 20px 0 #ffffff, -1px -1px 3px 0 #ffffff`
      : props.active
      ? `${props.theme.shadows.inset}`
      : '0 0 4px 0 #c5cad4, inset 0 0 4px 0 #ffffff'};
  transition: 0.3s ease-out;
  cursor: ${(props) => !props.disabled && 'pointer'};
  opacity: ${(props) => props.disabled && '0.5'};
`
const Icon = styled.img`
  transition: 0.5s;
`
