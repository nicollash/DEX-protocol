import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { StyledLink, StyledExternalLink } from 'theme'

const Button = ({
  children,
  disabled,
  href,
  onClick,
  size,
  text,
  to,
  bg,
  variant,
  block,
  fontColor,
  hover = true,
  style = {},
}) => {
  const { color, spacing } = useContext(ThemeContext)
  let buttonColor = ''

  switch (variant) {
    case 'secondary':
      buttonColor = color.grey[500]
      break
    default:
      buttonColor = bg ?? color.button.green
  }

  switch (fontColor) {
    case 'secondary':
      fontColor = color.grey[500]
      break
    case 'primary':
      fontColor = color.primary.main
      break
    default:
  }

  let boxShadow
  let buttonSize
  let buttonPadding
  let fontSize

  switch (size) {
    case 'sm':
      boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`
      buttonPadding = spacing[3]
      buttonSize = 36
      fontSize = 14
      break
    case 'lg':
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px ${color.grey[100]}ff;`
      buttonPadding = spacing[4]
      buttonSize = 72
      fontSize = 16
      break
    case 'md':
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`
      buttonPadding = spacing[4]
      buttonSize = 42
      fontSize = 14
      break
    default:
      boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`
      buttonPadding = spacing[4]
      buttonSize = 46
      fontSize = 16
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>
    } else if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      )
    } else {
      return text
    }
  }, [href, text, to])

  return (
    <>
      <StyledButton
        boxShadow={boxShadow}
        color={buttonColor}
        disabled={disabled}
        fontSize={fontSize}
        onClick={onClick}
        padding={buttonPadding}
        size={buttonSize}
        block={block}
        fontColor={fontColor}
        style={style}
        hover={hover}
      >
        {children}
        {ButtonChild}
      </StyledButton>
    </>
  )
}

const StyledButton = styled.button`
  align-items: center;
  background-color: ${(props) =>
    `${!props.disabled ? props.color : `${props.color}a1`}`};
  border: 1px solid
    ${(props) => (!props.disabled ? props.color : `${props.color}11`)};
  border-radius: 4px;
  color: ${(props) => (!props.color ? props.color : props.fontColor ?? `#fff`)};
  cursor: pointer;
  display: flex;
  font-size: ${(props) => props.fontSize}px;
  font-weight: 700;
  height: ${(props) => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: ${(props) => props.padding}px;
  padding-right: ${(props) => props.padding}px;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  width: ${(props) => props.block && '100%'};
  transition: background-color 0.3s ease-out;
  &:hover {
    background: ${(props) => props.hover && props.theme.color.button.main};
    border-color: ${(props) => props.hover && props.theme.color.button.main};
    color: #ffffff !important;
  }
  :disabled: {
    background: ${({ theme }) => theme.color.background.main};
    border-color: ${({ theme }) => theme.color.background.main};
  }
`

export const SwitchButton = styled.div`
  display: felx;
  align-items: center;
  justify-content: center;
  width: ${(props) => `${props.width ?? 65}px`};
  height: ${(props) => `${props.height ?? 27}px`};
  font-size: 13px;
  text-align: center;
  border-radius: 4px;
  font-weight: 800;
  line-height: 2.3;
  cursor: pointer;
  box-shadow: 8px 8px 20px 0 #d0d8e6, -8px -8px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  color: ${({ theme, selected }) =>
    selected ? 'rgba(33, 45, 99, 0.3)' : theme.color.secondary.main};
  background-color: ${({ theme }) => theme.color.background.main};
  &:hover {
    color: ${({ theme }) => theme.color.primary.main};
    box-shadow: 2px 2px 4px 0 #d0d8e6, -2px -2px 4px 0 #ffffff,
      -1px -1px 3px 0 #ffffff;
  }
`

export const HomePageButton = styled.button`
  padding: 13px 36px;
  border-radius: 4px;
  box-shadow: 6px 6px 20px 0 #bcc3cf, -6px -6px 20px 0 #ffffff,
    -1px -1px 3px 0 #ffffff;
  background-color: ${({ theme }) => theme.color.background.main};
  font-size: 16px;
  font-weight: 800;
  font-stretch: normal;
  text-align: center;
  cursor: pointer;
  color: #212d63;
  border: none;
  :hover {
    color: #38bf8c;
  }
`

export default Button
